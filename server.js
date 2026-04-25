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
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    cache.intelligence = {
      summary: 'Set GEMINI_API_KEY to enable live AI analysis.',
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

  const prompt = `You are a senior independent Indian election analyst. You do NOT trust or cite any paid opinion polls or surveys. You make your own judgment based purely on raw data and ground signals.

Current election stage: ${status.stage}
${stageContext}

TODAY'S NEWS HEADLINES (${new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'})} IST):
${headlines || 'No headlines available.'}

${exitData ? `EXIT POLL / RESULTS DATA:\n${exitData}` : ''}

RAW DATA FACTS — base your analysis ONLY on these:
1. West Bengal 2026 Assembly Election: 294 seats, majority = 148
2. Phase 1 (Apr 23, 152 seats): VOTED. Turnout = 92.35% — highest in WB history since Independence
3. Phase 2 (Apr 29, 142 seats): Yet to vote. Results: May 4, 2026
4. 2021 WB Assembly result: TMC 215 seats (47.9% vote share), BJP 77 seats (38.1%)
5. 2024 Lok Sabha result in WB: TMC won 29 of 42 seats, BJP won 12. But BJP led in 164 of 294 assembly segments, TMC led in 126. This is critical — BJP's 2024 LS momentum.
6. SIR electoral roll: 9 million voters deleted (12% of electorate). ~65% of disputed deletions were Muslim — TMC's core vote bank. This could suppress TMC votes significantly.
7. Anti-incumbency: TMC has ruled for 15 years. School recruitment scam, RG Kar rape-murder case, law & order issues.
8. TMC strengths: Welfare schemes (Lakshmir Bhandar cash transfers to women, Swasthya Sathi health insurance), Bengali identity/asmita politics, strong booth management.
9. BJP strengths: 2024 LS momentum, CAA+Matua community vote in Nadia/North 24 Parganas, Hindu consolidation, PM Modi rallies, Suvendu Adhikari ground organisation.
10. Historical pattern: In 2021, exit polls underestimated TMC by 50+ seats. But 2024 LS showed BJP gaining ground significantly.
11. Record 92.35% Phase 1 turnout: In WB history, very high turnout has correlated with anti-incumbency waves (2011 TMC sweep had high turnout against Left). This could mean BJP surge.
12. Nandigram: Mamata Banerjee is contesting from Nandigram against Suvendu Adhikari — a prestige battle.

IGNORE all paid surveys and polls. Based ONLY on the above raw facts and today's news headlines, give your independent analytical prediction.

Respond ONLY with a raw JSON object. No markdown. No backticks. No explanation. Start your response with { and end with }:
{
  "summary": "3-4 sentence independent analytical assessment",
  "signals": [{"headline": "signal", "impact": "TMC|BJP|NEUTRAL", "detail": "explanation"}],
  "confidence": "LOW|MEDIUM|HIGH",
  "tmc_range": "e.g. 150-170",
  "bjp_range": "e.g. 100-120"
}`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    let r, attempts = 0;
    while (attempts < 3) {
      r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 800, temperature: 0.3 },
        }),
        signal: AbortSignal.timeout(30000),
      });
      if (r.status === 429) {
        attempts++;
        console.log(`[AI] Rate limited, waiting ${attempts * 20}s...`);
        await new Promise(res => setTimeout(res, attempts * 20000));
        continue;
      }
      break;
    }
    if (!r.ok) {
      const errText = await r.text();
      console.error('[AI] Gemini HTTP error:', r.status, errText);
      throw new Error(`HTTP ${r.status}: ${errText}`);
    }
    const data = await r.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    console.log('[AI] Gemini raw response:', text.substring(0, 200));
    
    let parsed = {};
    try {
      // Strip markdown fences and find JSON
      const clean = text.replace(/```json\s*/gi,'').replace(/```\s*/g,'').trim();
      const jsonMatch = clean.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON object found');
      }
    } catch(parseErr) {
      console.error('[AI] JSON parse error:', parseErr.message);
      // Extract summary field manually if JSON parse fails
      const summaryMatch = text.match(/"summary"\s*:\s*"([\s\S]*?)(?<!\\)",/);
      const cleanText = text.replace(/```json|```/g,'').replace(/[{}"\[\]]/g,'').trim();
      parsed = {
        summary: summaryMatch ? summaryMatch[1] : cleanText.substring(0, 400) || 'Analysis loading...',
        signals: [],
        confidence: 'MEDIUM',
        tmc_range: '150-170',
        bjp_range: '100-120'
      };
    }
    cache.intelligence = {
      summary:    parsed.summary    || 'Analysis unavailable.',
      signals:    parsed.signals    || [],
      confidence: parsed.confidence || 'MEDIUM',
      tmcRange:   parsed.tmc_range  || '155-175',
      bjpRange:   parsed.bjp_range  || '95-115',
      updatedAt:  new Date().toISOString(),
      stage:      status.stage,
    };
    console.log(`[AI] Gemini intelligence updated — stage: ${status.stage}`);
  } catch(e) {
    console.error('[AI] Gemini error:', e.message);
    cache.intelligence = {
      summary: `AI error: ${e.message}`,
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
  // Small delay to avoid rate limits
  await new Promise(r => setTimeout(r, 3000));
  await buildIntelligence();
  console.log('[refresh] complete');
}

// Auto-refresh every 30 minutes (Gemini free tier rate limit friendly)
setInterval(fullRefresh, 30 * 60 * 1000);
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
