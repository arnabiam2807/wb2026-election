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

// ─────────────────────────────────────────────────────────────────────────────
// IN-MEMORY INTELLIGENCE CACHE
// Refreshes every 20 minutes automatically, or on demand via /api/refresh
// ─────────────────────────────────────────────────────────────────────────────
const cache = {
  news: { items: [], fetchedAt: null },
  intelligence: { summary: null, signals: [], updatedAt: null },
  exitPolls: { data: [], fetchedAt: null },
  status: null,
  lastFullRefresh: null,
};

// ─────────────────────────────────────────────────────────────────────────────
// ELECTION STATUS — computed from real-time clock
// ─────────────────────────────────────────────────────────────────────────────
function getElectionStatus() {
  const now = new Date();
  const phase1Start   = new Date('2026-04-23T07:00:00+05:30');
  const phase1End     = new Date('2026-04-23T18:00:00+05:30');
  const exitPollsLive = new Date('2026-04-29T18:30:00+05:30');
  const phase2Start   = new Date('2026-04-29T07:00:00+05:30');
  const phase2End     = new Date('2026-04-29T18:00:00+05:30');
  const resultsStart  = new Date('2026-05-04T08:00:00+05:30');

  let stage = 'pre-election';
  if      (now >= resultsStart)  stage = 'results-live';
  else if (now >= exitPollsLive) stage = 'exit-polls-live';
  else if (now >= phase2End)     stage = 'post-phase2';
  else if (now >= phase2Start)   stage = 'phase2-voting';
  else if (now >= phase1End)     stage = 'post-phase1';
  else if (now >= phase1Start)   stage = 'phase1-voting';

  return {
    stage,
    phase1Turnout: 92.35,
    phase2Turnout: null,        // will be filled when available
    exitPollsAt: exitPollsLive.toISOString(),
    resultsAt: resultsStart.toISOString(),
    serverTime: now.toISOString(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// NEWS FETCHER — Google News RSS for WB election
// ─────────────────────────────────────────────────────────────────────────────
async function fetchNews() {
  const queries = [
    'West Bengal election 2026',
    'Bengal election TMC BJP 2026',
    'West Bengal exit poll 2026',
  ];
  const allItems = [];
  for (const q of queries) {
    try {
      const url = `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-IN&gl=IN&ceid=IN:en`;
      const r = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; WB2026Bot/1.0)' },
        signal: AbortSignal.timeout(8000),
      });
      const xml = await r.text();
      const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(m => {
        const title = (m[1].match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) ||
                       m[1].match(/<title>(.*?)<\/title>/))?.[1] || '';
        const link  = (m[1].match(/<link>(.*?)<\/link>/))?.[1] || '#';
        const pub   = (m[1].match(/<pubDate>(.*?)<\/pubDate>/))?.[1] || '';
        const src   = (m[1].match(/<source[^>]*>(.*?)<\/source>/))?.[1] ||
                      (m[1].match(/<source[^>]*url="[^"]*"[^>]*>(.*?)<\/source>/))?.[1] || 'News';
        return {
          title: title.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&#39;/g,"'").trim(),
          link, pub, src,
          pubMs: pub ? new Date(pub).getTime() : 0,
        };
      });
      allItems.push(...items);
    } catch(e) { /* skip failed query */ }
  }

  // Deduplicate by title prefix, sort newest first
  const seen = new Set();
  const deduped = allItems
    .filter(i => {
      const key = i.title.substring(0, 60).toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return i.title.length > 10;
    })
    .sort((a, b) => b.pubMs - a.pubMs)
    .slice(0, 20);

  cache.news = { items: deduped, fetchedAt: new Date().toISOString() };
  console.log(`[news] fetched ${deduped.length} headlines`);
  return deduped;
}

// ─────────────────────────────────────────────────────────────────────────────
// EXIT POLL / RESULTS SCRAPER
// Activated only when stage >= exit-polls-live
// ─────────────────────────────────────────────────────────────────────────────
async function fetchExitPollData() {
  const status = getElectionStatus();
  if (!['exit-polls-live','results-live'].includes(status.stage)) {
    return cache.exitPolls;
  }

  const sources = [
    { name: 'NDTV', url: 'https://www.ndtv.com/elections/west-bengal-assembly-election' },
    { name: 'India Today', url: 'https://www.indiatoday.in/elections/west-bengal-assembly-elections-2026' },
    { name: 'Times Now', url: 'https://www.timesnownews.com/elections/west-bengal-assembly-elections' },
  ];

  const snippets = [];
  for (const src of sources) {
    try {
      const r = await fetch(src.url, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        signal: AbortSignal.timeout(10000),
      });
      const html = await r.text();
      // Extract numbers: seat counts like TMC 180, BJP 95 etc
      const text = html.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ');
      const relevant = text.match(/.{0,200}(TMC|Trinamool|BJP|exit poll|result|seats?|tally).{0,200}/gi) || [];
      if (relevant.length > 0) {
        snippets.push({ source: src.name, snippets: relevant.slice(0,3) });
      }
    } catch(e) { /* skip */ }
  }

  cache.exitPolls = { data: snippets, fetchedAt: new Date().toISOString() };
  return cache.exitPolls;
}

// ─────────────────────────────────────────────────────────────────────────────
// AI INTELLIGENCE — Claude analyses all fresh signals together
// ─────────────────────────────────────────────────────────────────────────────
async function buildIntelligence() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    cache.intelligence = {
      summary: 'Set ANTHROPIC_API_KEY to enable live AI analysis.',
      signals: [],
      updatedAt: new Date().toISOString(),
    };
    return;
  }

  const status = getElectionStatus();
  const headlines = cache.news.items.slice(0, 10).map(i => `- ${i.title} (${i.src})`).join('\n');
  const exitData  = cache.exitPolls.data.map(d =>
    `${d.source}: ${d.snippets.join(' | ')}`).join('\n');

  const stageContext = {
    'pre-election':    'Both phases are yet to vote.',
    'phase1-voting':   'Phase 1 (152 seats) is VOTING RIGHT NOW.',
    'post-phase1':     'Phase 1 (152 seats) has voted. Phase 2 votes Apr 29. Phase 1 turnout: 92.35% — highest ever.',
    'phase2-voting':   'Phase 2 (142 seats) is VOTING RIGHT NOW. Phase 1 turnout was 92.35%.',
    'post-phase2':     'BOTH phases have voted. Exit polls release at 6:30 PM today. Awaiting results (May 4).',
    'exit-polls-live': 'EXIT POLLS ARE NOW LIVE. Counting is on May 4.',
    'results-live':    'RESULTS ARE BEING COUNTED RIGHT NOW on May 4.',
  }[status.stage] || '';

  const prompt = `You are a senior Indian election analyst. Current stage: ${status.stage}.
${stageContext}

LATEST NEWS HEADLINES (last fetched ${new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'})} IST):
${headlines || 'No headlines available.'}

${exitData ? `EXIT POLL / RESULTS DATA:\n${exitData}` : ''}

ESTABLISHED CONTEXT:
- WB 2026 Assembly Election: 294 seats, majority = 148
- Phase 1 (Apr 23): 152 seats, 92.35% turnout — highest ever in West Bengal
- Phase 2 (Apr 29): 142 seats
- Results: May 4, 2026
- Pre-poll model: TMC ~175 seats, BJP ~93 seats (based on POLIQ + constituency data)
- Key factors: SIR deleted 9M voters (~65% Muslim), anti-incumbency (15 yrs TMC), welfare loyalty, Bengali asmita, CAA+Matua vote, RG Kar case, school scam

Based on ALL information above (especially any new signals from today's headlines), provide:
1. A direct 3–4 sentence current outlook — who wins, by how much, biggest uncertainty
2. Up to 5 specific fresh signals/developments extracted from today's news that could shift the prediction (if any)

Respond ONLY in this JSON format (no markdown, no explanation outside the JSON):
{
  "summary": "3-4 sentence analytical paragraph here",
  "signals": [
    {"headline": "brief signal title", "impact": "TMC|BJP|NEUTRAL", "detail": "one sentence explanation"},
    ...
  ],
  "confidence": "LOW|MEDIUM|HIGH",
  "tmc_range": "e.g. 155-175",
  "bjp_range": "e.g. 95-115"
}`;

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 700,
        messages: [{ role: 'user', content: prompt }],
      }),
      signal: AbortSignal.timeout(30000),
    });
    const data = await r.json();
    const text = data.content?.[0]?.text || '{}';
    // Strip any accidental markdown fences
    const clean = text.replace(/```json|```/g,'').trim();
    const parsed = JSON.parse(clean);
    cache.intelligence = {
      summary:    parsed.summary    || 'Analysis unavailable.',
      signals:    parsed.signals    || [],
      confidence: parsed.confidence || 'MEDIUM',
      tmcRange:   parsed.tmc_range  || '155-175',
      bjpRange:   parsed.bjp_range  || '95-115',
      updatedAt: new Date().toISOString(),
      stage: status.stage,
    };
    console.log(`[AI] intelligence updated — stage: ${status.stage}`);
  } catch(e) {
    console.error('[AI] error:', e.message);
    cache.intelligence = {
      summary: 'AI analysis temporarily unavailable.',
      signals: [],
      updatedAt: new Date().toISOString(),
      stage: status.stage,
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// FULL REFRESH — news + exit polls + AI in sequence
// ─────────────────────────────────────────────────────────────────────────────
async function fullRefresh() {
  console.log('[refresh] starting full intelligence refresh...');
  cache.lastFullRefresh = new Date().toISOString();
  await fetchNews();
  await fetchExitPollData();
  await buildIntelligence();
  console.log('[refresh] complete');
}

// Auto-refresh every 20 minutes
setInterval(fullRefresh, 20 * 60 * 1000);
// Kick off immediately on startup
fullRefresh();

// ─────────────────────────────────────────────────────────────────────────────
// API ROUTES
// ─────────────────────────────────────────────────────────────────────────────

// Anthropic proxy — keeps API key server-side
app.post('/api/claude', async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set' });
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(req.body),
      signal: AbortSignal.timeout(30000),
    });
    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Election status
app.get('/api/status', (req, res) => {
  res.json(getElectionStatus());
});

// News feed
app.get('/api/news', (req, res) => {
  res.json(cache.news.items.length > 0
    ? cache.news
    : { items: [], fetchedAt: null, pending: true });
});

// AI intelligence (main prediction engine)
app.get('/api/intelligence', (req, res) => {
  res.json({
    ...cache.intelligence,
    status: getElectionStatus(),
    lastFullRefresh: cache.lastFullRefresh,
  });
});

// Exit polls / results (when available)
app.get('/api/exitpolls', (req, res) => {
  res.json(cache.exitPolls);
});

// Manual trigger — force a fresh refresh right now
app.post('/api/refresh', async (req, res) => {
  res.json({ message: 'Refresh started', triggeredAt: new Date().toISOString() });
  await fullRefresh(); // runs after response is sent
});

// Full cache dump — for debugging
app.get('/api/cache', (req, res) => {
  res.json({
    lastFullRefresh: cache.lastFullRefresh,
    newsCount: cache.news.items.length,
    newsAge: cache.news.fetchedAt,
    intelligenceAge: cache.intelligence?.updatedAt,
    stage: getElectionStatus().stage,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`WB2026 server running on port ${PORT}`));
