# Bengal Verdict 2026 — Live Election Intelligence

AI-powered seat-by-seat prediction dashboard for all 294 West Bengal Assembly constituencies.

## Features
- All 294 constituencies with real candidate names (TMC + BJP)
- Live AI analysis powered by Claude (refreshes every 15 min)
- Live Google News feed (refreshes every 5 min)
- Filter/search by constituency, district, party, phase
- Click any seat for detailed breakdown
- Fully self-hosted, no third-party analytics

---

## Quick Start (Local)

```bash
# 1. Install dependencies
npm install

# 2. Set your Anthropic API key
export ANTHROPIC_API_KEY=sk-ant-...

# 3. Run
npm start

# Open http://localhost:3000
```

---

## Hosting Options

### Option 1: Railway (Recommended — Free tier)
1. Push to GitHub
2. Go to https://railway.app → New Project → Deploy from GitHub
3. Add environment variable: `ANTHROPIC_API_KEY=sk-ant-...`
4. Railway auto-detects Node.js and deploys
5. Get your public URL instantly

### Option 2: Render
1. Push to GitHub
2. Go to https://render.com → New Web Service → Connect repo
3. Build command: `npm install`
4. Start command: `npm start`
5. Add env var: `ANTHROPIC_API_KEY=sk-ant-...`

### Option 3: Fly.io
```bash
npm install -g flyctl
fly auth login
fly launch
fly secrets set ANTHROPIC_API_KEY=sk-ant-...
fly deploy
```

### Option 4: VPS / DigitalOcean / EC2
```bash
# On server:
git clone <your-repo>
cd wb2026
npm install
export ANTHROPIC_API_KEY=sk-ant-...
# Use PM2 for process management:
npm install -g pm2
pm2 start server.js --name wb2026
pm2 save
```

### Option 5: Vercel (Serverless — requires minor refactor)
Not recommended for this app since it uses Express. Use Railway/Render instead.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Your Anthropic API key |
| `PORT` | No | Port number (default: 3000) |

---

## Data Sources
- POLIQ constituency projection (Mar 30, 2026)
- Polity & Policy seat-by-seat analysis (Apr 22, 2026)
- IANS-Matrize Phase-1 survey (Apr 24, 2026)
- 2021 WB Assembly election results
- 2024 Lok Sabha segment data
- SIR electoral roll (CEO West Bengal)
- CSDS-Lokniti post-poll surveys

---

## Structure
```
wb2026/
├── server.js          # Express backend + API proxy
├── package.json
└── public/
    ├── index.html     # Main site
    ├── seats.js       # All 294 constituency data
    └── app.js         # Frontend logic
```

---

## Updating Predictions
Edit `public/seats.js` — each entry is:
```js
[no, name, district, winner, tmcCandidate, bjpCandidate, confidence, phase, category]
```
- `winner`: TMC | BJP | BGPM | INC | LF | SWING
- `confidence`: 0–100
- `phase`: 1 or 2
- `category`: '' | 'SC' | 'ST'
