import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── News cache ────────────────────────────────────────────────────────────────
let newsCache = { items: [], fetchedAt: null };
let intelligenceCache = { summary: null, signals: [], updatedAt: null };

async function fetchNews() {
  const queries = [
    'West Bengal election 2026',
    'Bengal election TMC BJP 2026',
  ];
  const allItems = [];
  for (const q of queries) {
    try {
      const url = `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-IN&gl=IN&ceid=IN:en`;
      const r = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        signal: AbortSignal.timeout(8000),
      });
      const xml = await r.text();
      const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(m => {
        const title = (m[1].match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || m[1].match(/<title>(.*?)<\/title>/))?.[1] || '';
        const link  = (m[1].match(/<link>(.*?)<\/link>/))?.[1] || '#';
        const pub   = (m[1].match(/<pubDate>(.*?)<\/pubDate>/))?.[1] || '';
        const src   = (m[1].match(/<source[^>]*>(.*?)<\/source>/))?.[1] || 'News';
        return {
          title: title.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&#39;/g,"'").trim(),
          link, pub, src, pubMs: pub ? new Date(pub).getTime() : 0,
        };
      });
      allItems.push(...items);
    } catch(e) {}
  }
  const seen = new Set();
  newsCache = {
    items: allItems
      .filter(i => { const k = i.title.substring(0,60).toLowerCase(); if(seen.has(k)) return false; seen.add(k); return i.title.length > 10; })
      .sort((a,b) => b.pubMs - a.pubMs)
      .slice(0, 20),
    fetchedAt: new Date().toISOString(),
  };
  console.log(`[news] fetched ${newsCache.items.length} headlines`);
}

// Auto-refresh news every 15 minutes
setInterval(fetchNews, 15 * 60 * 1000);
fetchNews();

// ── Election status ───────────────────────────────────────────────────────────
function getStatus() {
  const now = new Date();
  const stages = [
    [new Date('2026-05-04T02:30:00Z'), 'results-live'],
    [new Date('2026-04-29T13:00:00Z'), 'exit-polls-live'],
    [new Date('2026-04-29T12:30:00Z'), 'post-phase2'],
    [new Date('2026-04-29T01:30:00Z'), 'phase2-voting'],
    [new Date('2026-04-23T12:30:00Z'), 'post-phase1'],
    [new Date('2026-04-23T01:30:00Z'), 'phase1-voting'],
  ];
  const stage = stages.find(([t]) => now >= t)?.[1] || 'pre-election';
  return { stage, phase1Turnout: 92.35, phase2TurnoutSoFar: 18.39, serverTime: now.toISOString() };
}

// ── Live results tracker (May 4 counting) ────────────────────────────────────
let resultsCache = { tmc_leading: 0, bjp_leading: 0, other_leading: 0, declared: 0, updated_at: null };

async function fetchLiveCountingData() {
  const status = getStatus();
  if (status.stage !== 'results-live') return;
  try {
    // Try scraping ECI results page
    const r = await fetch('https://results.eci.gov.in/ResultAcGenMar2026/partywiseresult-S07.htm', {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(10000),
    });
    const html = await r.text();
    // Parse basic tallies
    const tmcMatch = html.match(/Trinamool.*?(\d+)/i);
    const bjpMatch = html.match(/Bharatiya Janata.*?(\d+)/i);
    if (tmcMatch || bjpMatch) {
      resultsCache = {
        tmc_leading: tmcMatch ? parseInt(tmcMatch[1]) : 0,
        bjp_leading: bjpMatch ? parseInt(bjpMatch[1]) : 0,
        other_leading: 0,
        declared: 0,
        updated_at: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }),
      };
    }
  } catch(e) {
    console.log('[results] not yet available or fetch failed');
  }
}

// Check for results every 3 minutes on May 4
setInterval(() => {
  if (getStatus().stage === 'results-live') fetchLiveCountingData();
}, 3 * 60 * 1000);

app.get('/api/results', (req, res) => res.json(resultsCache));
app.get('/api/news', (req, res) => res.json(newsCache));
app.get('/api/status', (req, res) => res.json(getStatus()));
app.get('/api/intelligence', (req, res) => {
  // Returns cached AI analysis if available, otherwise empty
  res.json(intelligenceCache);
});
app.post('/api/refresh', async (req, res) => {
  res.json({ ok: true });
  await fetchNews();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`WB2026 server running on port ${PORT}`));
