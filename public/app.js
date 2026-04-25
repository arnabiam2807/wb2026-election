// Bengal Verdict 2026 — Frontend App
// Fully live: consumes /api/intelligence, /api/news, /api/status, /api/exitpolls

const API = '';   // same origin

// ── State ─────────────────────────────────────────────────────────────────────
let sortKey = 'no', sortAsc = true, selectedRow = null;
let currentStage = 'post-phase1';

// ── Clock ─────────────────────────────────────────────────────────────────────
function updateClock() {
  const el = document.getElementById('clock');
  if (el) el.textContent = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  }) + ' IST';
}
setInterval(updateClock, 1000);
updateClock();

// ── Seat metrics & bar ────────────────────────────────────────────────────────
function computeCounts() {
  const c = {};
  SEATS.forEach(s => { c[s[3]] = (c[s[3]] || 0) + 1; });
  return c;
}

function animateNum(id, val) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = `<span class="number-tick">${val}</span>`;
}

function updateMetrics(intelligence) {
  const c = computeCounts();
  const tmcEl = document.getElementById('m-tmc');
  const bjpEl = document.getElementById('m-bjp');
  if (tmcEl) tmcEl.innerHTML = `<span class="number-tick">${intelligence?.tmcRange || c.TMC || 0}</span>`;
  if (bjpEl) bjpEl.innerHTML = `<span class="number-tick">${intelligence?.bjpRange || c.BJP || 0}</span>`;
  const oth = (c.BGPM||0) + (c.INC||0) + (c.LF||0);
  animateNum('m-oth', oth);
  animateNum('m-swing', c.SWING || 0);
  const sub = document.getElementById('m-oth-sub');
  if (sub) sub.textContent = `BGPM·${c.BGPM||0}  INC·${c.INC||0}  LF·${c.LF||0}`;

  const total = 294;
  [
    ['sb-tmc', c.TMC, 'leg-tmc'],
    ['sb-bjp', c.BJP, 'leg-bjp'],
    ['sb-bgpm', c.BGPM, 'leg-bgpm'],
    ['sb-inc', c.INC, 'leg-inc'],
    ['sb-lf', c.LF, 'leg-lf'],
    ['sb-swing', c.SWING, 'leg-sw'],
  ].forEach(([id, val, legId]) => {
    const v = val || 0;
    const el = document.getElementById(id);
    if (el) { el.style.width = (v / total * 100).toFixed(2) + '%'; el.textContent = v >= 15 ? v : ''; }
    const leg = document.getElementById(legId);
    if (leg) leg.textContent = `(${v})`;
  });
}

// ── Stage-aware banner ────────────────────────────────────────────────────────
function updateStageBanner(status) {
  if (!status) return;
  currentStage = status.stage;
  const el = document.getElementById('ph2status');
  if (el) {
    const labels = {
      'pre-election':    'Apr 29 · 142 seats · Upcoming',
      'phase1-voting':   'Apr 29 · 142 seats · Upcoming',
      'post-phase1':     'Apr 29 · 142 seats · Upcoming',
      'phase2-voting':   `<span style="color:#f0960a;font-weight:500">● Voting NOW — Apr 29</span>`,
      'post-phase2':     `Apr 29 · 142 seats · <span style="color:#1db87b">✓ Voted</span>`,
      'exit-polls-live': `<span style="color:#f0960a;font-weight:500">EXIT POLLS LIVE</span>`,
      'results-live':    `<span style="color:#1db87b;font-weight:500">RESULTS COUNTING — May 4</span>`,
    };
    el.innerHTML = labels[status.stage] || el.innerHTML;
  }

  if (['exit-polls-live','results-live'].includes(status.stage)) {
    if (!document.getElementById('exitPollBanner')) {
      const banner = document.createElement('div');
      banner.id = 'exitPollBanner';
      banner.style.cssText = 'background:rgba(240,150,10,0.1);border:1px solid rgba(240,150,10,0.35);border-radius:10px;padding:14px 20px;margin-bottom:24px;font-size:14px;font-weight:500;color:#f0d080;text-align:center;animation:fadeIn 0.4s ease';
      banner.textContent = status.stage === 'results-live'
        ? '🗳️ RESULTS ARE BEING COUNTED — May 4, 2026. Predictions updating live.'
        : '📊 EXIT POLLS ARE LIVE. AI prediction updating. Results: May 4.';
      document.querySelector('.hero')?.prepend(banner);
    }
  }
}

// ── Intelligence panel ────────────────────────────────────────────────────────
function renderIntelligence(data) {
  const textEl = document.getElementById('aiText');
  const updEl  = document.getElementById('aiUpdated');
  const signalsEl = document.getElementById('aiSignals');

  if (textEl) textEl.textContent = data.summary || 'Loading analysis...';

  if (signalsEl) {
    if (data.signals && data.signals.length > 0) {
      signalsEl.style.display = 'block';
      signalsEl.innerHTML = `
        <div style="font-size:10px;font-family:'JetBrains Mono',monospace;color:var(--muted);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:10px;margin-top:14px">
          Live signals — ${data.signals.length} detected from today's news
        </div>
        ${data.signals.map(s => `
          <div style="display:flex;gap:8px;align-items:flex-start;padding:8px 0;border-bottom:1px solid var(--border)">
            <span style="font-size:10px;padding:2px 7px;border-radius:4px;flex-shrink:0;font-family:'JetBrains Mono',monospace;margin-top:2px;
              background:${s.impact==='TMC'?'var(--tmc-dim)':s.impact==='BJP'?'var(--bjp-dim)':'var(--swing-dim)'};
              color:${s.impact==='TMC'?'var(--tmc)':s.impact==='BJP'?'var(--bjp)':'var(--swing)'}">
              ${s.impact}
            </span>
            <div>
              <div style="font-size:12px;font-weight:500;color:var(--text);margin-bottom:2px">${s.headline}</div>
              <div style="font-size:11px;color:var(--muted);line-height:1.5">${s.detail}</div>
            </div>
          </div>
        `).join('')}
      `;
    } else {
      signalsEl.style.display = 'none';
    }
  }

  if (updEl && data.updatedAt) {
    const t = new Date(data.updatedAt).toLocaleTimeString('en-IN',
      { timeZone:'Asia/Kolkata', hour:'2-digit', minute:'2-digit' });
    updEl.textContent = `Updated ${t} IST · Stage: ${data.stage || currentStage}${data.confidence ? ' · Confidence: '+data.confidence : ''}`;
  }

  updateMetrics(data);
}

// ── News feed ─────────────────────────────────────────────────────────────────
function renderNews(data) {
  const el = document.getElementById('newsFeed');
  if (!el) return;
  if (!data.items || data.items.length === 0) {
    el.innerHTML = '<div class="news-loading">No headlines right now — retrying soon.</div>';
    return;
  }
  el.innerHTML = data.items.slice(0, 10).map(item => `
    <div class="news-item">
      <div class="news-title"><a href="${item.link}" target="_blank" rel="noopener">${item.title}</a></div>
      <div class="news-meta">${item.src || 'News'}${item.pub ? ' · ' + new Date(item.pub).toLocaleDateString('en-IN',{day:'2-digit',month:'short'}) : ''}</div>
    </div>
  `).join('');
  const ageEl = document.getElementById('newsAge');
  if (ageEl && data.fetchedAt) {
    ageEl.textContent = 'at ' + new Date(data.fetchedAt).toLocaleTimeString('en-IN',
      { timeZone:'Asia/Kolkata', hour:'2-digit', minute:'2-digit' });
  }
}

// ── District breakdown ────────────────────────────────────────────────────────
function buildDistrictBreakdown() {
  const dmap = {};
  SEATS.forEach(s => {
    if (!dmap[s[2]]) dmap[s[2]] = { TMC:0, BJP:0, OTH:0 };
    if (s[3]==='TMC') dmap[s[2]].TMC++;
    else if (s[3]==='BJP') dmap[s[2]].BJP++;
    else dmap[s[2]].OTH++;
  });
  const el = document.getElementById('districtBreakdown');
  if (el) el.innerHTML = Object.entries(dmap)
    .sort((a,b) => (b[1].TMC+b[1].BJP) - (a[1].TMC+a[1].BJP))
    .map(([d,v]) => `
      <div class="district-row">
        <div class="district-name">${d}</div>
        <div class="district-seats">
          <span class="ds-tmc">T:${v.TMC}</span>
          <span class="ds-bjp">B:${v.BJP}</span>
          ${v.OTH > 0 ? `<span style="color:var(--bgpm)">O:${v.OTH}</span>` : ''}
        </div>
      </div>
    `).join('');
}

// ── Table ─────────────────────────────────────────────────────────────────────
function buildDistrictFilter() {
  const sel = document.getElementById('filterDistrict');
  if (!sel) return;
  [...new Set(SEATS.map(s => s[2]))].sort().forEach(d => {
    const o = document.createElement('option');
    o.value = d; o.textContent = d; sel.appendChild(o);
  });
}

function filterTable() { renderTable(); }

function sortBy(key) {
  sortAsc = sortKey === key ? !sortAsc : true;
  sortKey = key;
  renderTable();
}

function renderTable() {
  const q  = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();
  const fp = document.getElementById('filterParty')?.value || '';
  const fd = document.getElementById('filterDistrict')?.value || '';
  const fph= document.getElementById('filterPhase')?.value || '';
  const keyMap = { no:0, name:1, district:2, winner:3, conf:6, phase:7 };

  const list = SEATS
    .filter(s =>
      (!q  || s[1].toLowerCase().includes(q) || s[4].toLowerCase().includes(q) || s[5].toLowerCase().includes(q)) &&
      (!fp || s[3] === fp) && (!fd || s[2] === fd) && (!fph || s[7] === parseInt(fph))
    )
    .sort((a,b) => {
      const ki = keyMap[sortKey] ?? 0;
      const va = a[ki], vb = b[ki];
      return sortAsc
        ? (typeof va==='string' ? va.localeCompare(vb) : va-vb)
        : (typeof va==='string' ? vb.localeCompare(va) : vb-va);
    });

  const tbody = document.getElementById('tblBody');
  if (!tbody) return;
  tbody.innerHTML = '';
  list.forEach(s => {
    const [no, name, district, winner, tmc, bjp, conf, phase, cat] = s;
    const color = PARTY_COLORS[winner] || '#6b7585';
    const tr = document.createElement('tr');
    if (selectedRow === no) tr.classList.add('selected');
    tr.onclick = () => showDetail(no - 1);
    tr.innerHTML = `
      <td><span class="seat-no">${no}</span></td>
      <td><span class="seat-name">${name}</span>${cat?`<span class="seat-cat"> ${cat}</span>`:''}  </td>
      <td><span class="seat-district">${district}</span></td>
      <td><span class="winner-badge w-${winner.toLowerCase()}">${winner}</span></td>
      <td><span class="cand-name" title="${tmc}">${tmc}</span></td>
      <td><span class="cand-name" title="${bjp}">${bjp}</span></td>
      <td><div class="conf-wrap"><span class="conf-num">${conf}%</span>
          <div class="conf-bar"><div class="conf-fill" style="width:${conf}%;background:${color}"></div></div>
      </div></td>
      <td><span class="phase-tag">Ph ${phase}</span></td>
    `;
    tbody.appendChild(tr);
  });
  const cnt = document.getElementById('tblCount');
  if (cnt) cnt.textContent = `${list.length} of ${SEATS.length} seats`;
}

// ── Detail panel ──────────────────────────────────────────────────────────────
function showDetail(idx) {
  const s = SEATS[idx];
  if (!s) return;
  const [no, name, district, winner, tmc, bjp, conf, phase, cat] = s;
  selectedRow = no;
  renderTable();
  const color = PARTY_COLORS[winner] || '#6b7585';
  document.getElementById('dp-name').textContent = name;
  document.getElementById('dp-meta').textContent =
    `#${no} · ${district}${cat?' · '+cat:''} · Phase ${phase} · Confidence: ${conf}%`;
  document.getElementById('dp-grid').innerHTML = `
    <div class="detail-stat"><div class="detail-stat-label">Predicted winner</div>
      <div class="detail-stat-val" style="color:${color}">${winner}</div></div>
    <div class="detail-stat"><div class="detail-stat-label">Confidence</div>
      <div class="detail-stat-val">${conf}%</div></div>
    <div class="detail-stat"><div class="detail-stat-label">TMC candidate</div>
      <div class="detail-stat-val" style="font-size:13px">${tmc}</div></div>
    <div class="detail-stat"><div class="detail-stat-label">BJP candidate</div>
      <div class="detail-stat-val" style="font-size:13px">${bjp}</div></div>
  `;
  document.getElementById('dp-reason').textContent = WINNER_REASONS[winner] || WINNER_REASONS.TMC;
  document.getElementById('dp-actions').innerHTML = `
    <button class="detail-btn" onclick="copyPrompt('Detailed analysis: ${name} constituency WB 2026 — candidates, 2021 result, 2024 LS data, local factors')">Copy analysis prompt</button>
    <button class="detail-btn" onclick="copyPrompt('Key swing factors in ${district} district, WB 2026 election')">Copy district prompt</button>
    <button class="detail-btn" onclick="closeDetail()">Close</button>
  `;
  document.getElementById('detailPanel')?.classList.add('open');
  document.getElementById('detailPanel')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function closeDetail() {
  document.getElementById('detailPanel')?.classList.remove('open');
  selectedRow = null;
  renderTable();
}

function copyPrompt(text) {
  navigator.clipboard?.writeText(text)
    .then(() => showToast('Prompt copied — paste in Claude or any AI'))
    .catch(() => showToast(text.substring(0,80)+'…'));
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ── Shimmer ───────────────────────────────────────────────────────────────────
function showShimmer(id) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = `
    <div class="shimmer" style="width:95%"></div>
    <div class="shimmer" style="width:78%;margin-top:6px"></div>
    <div class="shimmer" style="width:88%;margin-top:6px"></div>
  `;
}

// ── Full refresh (button + on-load) ──────────────────────────────────────────
async function fullRefresh() {
  const btn = document.getElementById('refreshBtn');
  if (btn) { btn.classList.add('spinning'); btn.textContent = '↻ Refreshing…'; }
  showShimmer('aiText');

  try {
    const [intel, news, status] = await Promise.allSettled([
      fetch(`${API}/api/intelligence`).then(r => r.json()),
      fetch(`${API}/api/news`).then(r => r.json()),
      fetch(`${API}/api/status`).then(r => r.json()),
    ]);

    if (intel.status === 'fulfilled' && intel.value) {
      renderIntelligence(intel.value);
    } else {
      const aiEl = document.getElementById('aiText');
      if (aiEl) aiEl.textContent = 'Server warming up — AI analysis will appear in ~30 seconds. The server is fetching live data now.';
    }
    if (news.status === 'fulfilled') renderNews(news.value);
    if (status.status === 'fulfilled') updateStageBanner(status.value);

    // Trigger a fresh server-side pull (fire and forget)
    fetch(`${API}/api/refresh`, { method: 'POST' }).catch(() => {});
    showToast('Live data updated');
  } catch(e) {
    const aiEl = document.getElementById('aiText');
    if (aiEl) aiEl.textContent = 'Could not reach server. Make sure it is running at ' + window.location.origin;
  }

  if (btn) { btn.classList.remove('spinning'); btn.textContent = '↻ Refresh'; }
}

// Soft background pull every 2 min (no shimmer, no toast)
async function softRefresh() {
  try {
    const [intel, news, status] = await Promise.allSettled([
      fetch(`${API}/api/intelligence`).then(r => r.json()),
      fetch(`${API}/api/news`).then(r => r.json()),
      fetch(`${API}/api/status`).then(r => r.json()),
    ]);
    if (intel.status==='fulfilled' && intel.value) renderIntelligence(intel.value);
    if (news.status==='fulfilled') renderNews(news.value);
    if (status.status==='fulfilled') updateStageBanner(status.value);
  } catch(e) { /* silent */ }
}

setInterval(softRefresh, 2 * 60 * 1000);  // pull every 2 min

// ── Init ──────────────────────────────────────────────────────────────────────
function init() {
  buildDistrictFilter();
  updateMetrics(null);
  renderTable();
  buildDistrictBreakdown();
  fullRefresh();
}

document.addEventListener('DOMContentLoaded', init);
