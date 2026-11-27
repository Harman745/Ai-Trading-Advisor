import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sirv from 'sirv';
import { createAdvisorHandler } from './advisor.js';

if (existsSync('.env')) process.loadEnvFile('.env');
const dist = fileURLToPath(new URL('../dist/', import.meta.url));
if (!existsSync(dist + 'index.html')) throw new Error('Build the site with npm run build before starting it.');
const assets = sirv(dist, {dev: false});
const advisor = createAdvisorHandler({apiKey: process.env.OPENAI_API_KEY});
const port = Number(process.env.PORT || 3000);
createServer((req, res) => {
  if (req.url?.split('?')[0] === '/api/advisor') return advisor(req, res);
  assets(req, res);
}).listen(port, () => console.log(`Trading Advisor listening on port ${port}`));
