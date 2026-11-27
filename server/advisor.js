import { makeMessages, readResult } from './tasks.js';

const maxBody = 7 * 1024 * 1024;
const hour = 60 * 60 * 1000;

function reply(res, status, value) {
  res.writeHead(status, {'Content-Type': 'application/json', 'Cache-Control': 'no-store'});
  res.end(JSON.stringify(value));
}

export function createAdvisorHandler({apiKey, fetchImpl = fetch}) {
  let windowStart = Date.now();
  let calls = 0;
  let active = 0;

  return async function handle(req, res) {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return reply(res, 405, {error: 'Use POST for advisor requests.'});
    }
    if (req.headers['content-type']?.split(';')[0].trim() !== 'application/json')
      return reply(res, 415, {error: 'Send an application/json request.'});
    if (!apiKey) return reply(res, 503, {error: 'AI features are unavailable. Set OPENAI_API_KEY on the server to enable them.'});
    if (Number(req.headers['content-length']) > maxBody) return reply(res, 413, {error: 'The chart is too large.'});

    let input;
    try {
      let size = 0;
      const chunks = [];
      for await (const chunk of req) {
        size += chunk.length;
        if (size > maxBody) return reply(res, 413, {error: 'The chart is too large.'});
        chunks.push(chunk);
      }
      input = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    } catch {
      return reply(res, 400, {error: 'The request could not be read.'});
    }
    const messages = makeMessages(input);
    if (!messages) return reply(res, 400, {error: 'Check the asset symbols, question length, or chart format and size.'});
    if (Date.now() - windowStart >= hour) {
      windowStart = Date.now();
      calls = 0;
    }
    if (calls >= 60 || active >= 4) return reply(res, 429, {error: 'The demo is busy or has reached its hourly AI limit. Try again later.'});
    calls++;
    active++;
    try {
      const response = await fetchImpl('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json'},
        signal: AbortSignal.timeout(45000),
        body: JSON.stringify({
          model: 'gpt-4o-mini', messages, max_tokens: 2048,
          ...(input.task === 'question' ? {} : {response_format: {type: 'json_object'}})
        })
      });
      if (!response.ok) {
        return reply(res, response.status === 429 ? 429 : 502, {error: response.status === 429
          ? 'The AI provider has reached its request or usage limit.'
          : 'The AI provider could not complete the request. Check the server configuration or try again.'});
      }
      const data = await response.json();
      const result = readResult(input, data.choices?.[0]?.message?.content);
      return reply(res, 200, {result});
    } catch (error) {
      const timedOut = error.name === 'TimeoutError';
      return reply(res, timedOut ? 504 : 502, {error: timedOut ? 'The AI request timed out. Try again.' : 'The AI response was unavailable or incomplete. Try again.'});
    } finally {
      active--;
    }
  };
}
