import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { readFileSync } from 'node:fs';
import { createAdvisorHandler } from '../server/advisor.js';
import { readResult } from '../server/tasks.js';
import { hasEstimate, summarizePortfolio, evaluateAlert } from '../src/estimates.js';

const examples = JSON.parse(readFileSync(new URL('../server/response-examples.json', import.meta.url)));
async function endpoint(t, fetchImpl, apiKey = 'test-server-key') {
  const server = createServer(createAdvisorHandler({apiKey, fetchImpl}));
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise(resolve => server.close(resolve)));
  return body => fetch(`http://127.0.0.1:${server.address().port}/api/advisor`, {
    method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body)
  });
}
const completion = content => Response.json({choices: [{message: {content}}]});

test('all AI tools use their expected OpenAI message format and return usable results', async t => {
  const cases = [
    [{task: 'single', symbol: 'BTC'}, examples.single],
    [{task: 'compare', symbols: ['BTC', 'ETH']}, examples.compare],
    [{task: 'sentiment', symbol: 'AAPL'}, examples.sentiment],
    [{task: 'chart', mimeType: 'image/png', image: 'aGVsbG8='}, examples.chart],
    [{task: 'estimates', symbols: ['AAA', 'BBB', 'CCC']}, {prices: {AAA: 123, BBB: null, CCC: null}}],
    [{task: 'question', question: 'What is diversification?', context: 'Practice portfolio'}, 'A mixture of holdings.']
  ];
  let current;
  const post = await endpoint(t, async (url, options) => {
    assert.equal(url, 'https://api.openai.com/v1/chat/completions');
    assert.equal(options.headers.Authorization, 'Bearer test-server-key');
    const body = JSON.parse(options.body);
    assert.match(body.messages[0].content, /no live market/i);
    assert.equal(body.response_format?.type, current[0].task === 'question' ? undefined : 'json_object');
    const content = body.messages[1].content;
    if (current[0].task === 'chart') {
      assert.equal(content[0].type, 'text');
      assert.equal(content[1].image_url.url, 'data:image/png;base64,aGVsbG8=');
    }
    if (current[0].task === 'estimates') return completion('{"prices":{"AAA":123,"BBB":-1,"EXTRA":9}}');
    return completion(typeof current[1] === 'string' ? current[1] : JSON.stringify(current[1]));
  });
  for (current of cases) {
    const res = await post(current[0]);
    assert.equal(res.status, 200, current[0].task);
    assert.deepEqual(await res.json(), {result: current[1]});
  }
});

test('invalid input, missing configuration and provider failures have explicit error states', async t => {
  const missing = await endpoint(t, () => assert.fail(), '');
  assert.equal((await missing({task: 'single', symbol: 'BTC'})).status, 503);
  const post = await endpoint(t, () => completion('{"assets":[]}'));
  assert.equal((await post({task: 'compare', symbols: ['BTC', 'ETH']})).status, 502);
  assert.equal((await post({task: 'chart', mimeType: 'text/html', image: 'abc'})).status, 400);
  assert.equal((await post({task: 'something else'})).status, 400);
  const quota = await endpoint(t, () => new Response(null, {status: 429}));
  assert.equal((await quota({task: 'single', symbol: 'BTC'})).status, 429);
  assert.throws(() => readResult({task: 'single'}, 'bad JSON'));
});

test('unpriced holdings do not contribute fictitious gains or losses', () => {
  const first = {symbol: 'ABC', quantity: 2, buyPrice: 10, currentPrice: 10};
  assert.equal(hasEstimate(first), false);
  const marked = {...first, currentPrice: 15, lastUpdated: '2026-01-01'};
  assert.equal(summarizePortfolio([marked, first]), null);
  assert.equal(summarizePortfolio([marked]).totalPL, 10);
  assert.equal(summarizePortfolio([marked]).totalPLPercent, 50);
});

test('simulated alerts retain the first valid estimate as their baseline and fire once', () => {
  const initial = {condition: 'change_up', percentage: 10};
  assert.equal(evaluateAlert(initial, null, 'first'), initial);
  const saved = evaluateAlert(initial, 100, 'first');
  assert.equal(saved.baselineEstimate, 100);
  assert.equal(saved.triggered, undefined);
  const triggered = evaluateAlert(saved, 110, 'second');
  assert.equal(triggered.triggeredPrice, 110);
  assert.equal(evaluateAlert(triggered, 120, 'third'), triggered);
  assert.equal(evaluateAlert({condition: 'below', price: 5}, 4, 'now').triggered, true);
});
