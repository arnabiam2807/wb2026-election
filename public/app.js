// Bengal Verdict 2026 — App with Monte Carlo Simulation Engine
// No external AI API needed. Runs 10,000 simulations in browser.

const API = '';
let sortKey = 'no', sortAsc = true, selectedRow = null;
let currentStage = 'post-phase1';
let lastMCResult = null;

// ── Clock ─────────────────────────────────────────────────────────────────────
function updateClock() {
  const el = document.getElementById('clock');
  if (el) el.textContent = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  }) + ' IST';
}
setInterval(updateClock, 1000);
updateClock();

// ── Tab switching ─────────────────────────────────────────────────────────────
function switchTab(tab) {
  document.getElementById('panel-ai').style.display  = tab === 'ai' ? 'block' : 'none';
  document.getElementById('panel-mc').style.display  = tab === 'mc' ? 'block' : 'none';
  document.getElementById('tab-ai').classList.toggle('active', tab === 'ai');
  document.getElementById('tab-mc').classList.toggle('active', tab === 'mc');
  // Auto-run simulation when switching to MC tab for first time
  if (tab === 'mc' && !lastMCResult) runSimulation();
}

// ── AI Analysis (Gemini) ──────────────────────────────────────────────────────
async function fetchAIAnalysis() {
  const apiKey = null; // Set GEMINI_API_KEY on server; this calls the proxy
  try {
    const r = await fetch(`${API}/api/intelligence`);
    if (!r.ok) throw new Error('No AI endpoint');
    const data = await r.json();
    return data;
  } catch(e) {
    return null;
  }
}

async function refreshAI() {
  const btn = document.getElementById('aiRefreshBtn');
  const textEl = document.getElementById('aiText');
  if (btn) { btn.textContent = '↻ Refreshing…'; btn.style.opacity = '0.6'; }
  if (textEl) textEl.innerHTML = `
    <div class="shimmer" style="width:95%"></div>
    <div class="shimmer" style="width:80%;margin-top:6px"></div>
    <div class="shimmer" style="width:88%;margin-top:6px"></div>`;

  try {
    // Try server intelligence endpoint first
    const data = await fetchAIAnalysis();
    if (data && data.summary && !data.summary.includes('error') && !data.summary.includes('unavailable')) {
      renderAI(data);
    } else {
      // Fallback: generate summary from Monte Carlo result
      renderAIFromMC();
    }
  } catch(e) {
    renderAIFromMC();
  }
  if (btn) { btn.textContent = '↻ Refresh AI'; btn.style.opacity = '1'; }
}

function renderAI(data) {
  const textEl = document.getElementById('aiText');
  const updEl = document.getElementById('aiUpdated');
  const sigEl = document.getElementById('aiSignals');
  if (textEl) textEl.textContent = data.summary || '';
  if (updEl && data.updatedAt) {
    updEl.textContent = 'Updated ' + new Date(data.updatedAt).toLocaleTimeString('en-IN',
      {timeZone:'Asia/Kolkata', hour:'2-digit', minute:'2-digit'}) + ' IST';
  }
  if (sigEl && data.signals && data.signals.length > 0) {
    sigEl.style.display = 'block';
    sigEl.innerHTML = `
      <div style="font-size:10px;font-family:'JetBrains Mono',monospace;color:var(--muted);text-transform:uppercase;letter-spacing:0.1em;margin:12px 0 8px">Live signals</div>
      ${data.signals.map(s => `
        <div style="display:flex;gap:8px;align-items:flex-start;padding:7px 0;border-bottom:1px solid var(--border)">
          <span style="font-size:10px;padding:2px 6px;border-radius:4px;flex-shrink:0;font-family:var(--mono);
            background:${s.impact==='TMC'?'var(--tmc-dim)':s.impact==='BJP'?'var(--bjp-dim)':'var(--swing-dim)'};
            color:${s.impact==='TMC'?'var(--tmc)':s.impact==='BJP'?'var(--bjp)':'var(--swing)'}">
            ${s.impact}</span>
          <div>
            <div style="font-size:12px;font-weight:500;color:var(--text)">${s.headline}</div>
            <div style="font-size:11px;color:var(--muted);line-height:1.5">${s.detail}</div>
          </div>
        </div>`).join('')}`;
  } else if (sigEl) {
    sigEl.style.display = 'none';
  }
}

function renderAIFromMC() {
  // Generate a human-readable summary from the Monte Carlo result
  const textEl = document.getElementById('aiText');
  const updEl = document.getElementById('aiUpdated');
  const sigEl = document.getElementById('aiSignals');
  if (sigEl) sigEl.style.display = 'none';

  if (lastMCResult) {
    const r = lastMCResult;
    const scenario = document.getElementById('scenarioSelect')?.value || 'base';
    const scenarioLabel = MC.SCENARIOS[scenario]?.label || 'Base case';
    const summary = `Monte Carlo simulation (${r.N.toLocaleString()} runs, ${scenarioLabel} scenario): ` +
      `TMC is projected to win ${r.tmcMean} seats (90% CI: ${r.tmcRange}), while BJP wins ${r.bjpMean} seats (90% CI: ${r.bjpRange}). ` +
      `TMC retains majority in ${r.tmcMajorityProb}% of simulations. ` +
      `Key uncertainties: SIR voter deletions in Muslim-majority constituencies, Matua consolidation in Nadia/North 24 Parganas, ` +
      `JUP vote split in Murshidabad, and whether the record 91.58% Phase 1 turnout signals anti-incumbency or TMC mobilisation. ` +
      `Switch to the Monte Carlo tab for the full probability distribution.`;
    if (textEl) textEl.textContent = summary;
    if (updEl) updEl.textContent = 'Generated from simulation · ' +
      new Date().toLocaleTimeString('en-IN', {timeZone:'Asia/Kolkata', hour:'2-digit', minute:'2-digit'}) + ' IST';
  } else {
    if (textEl) textEl.textContent =
      'Click "Refresh AI" to load the latest analysis, or switch to the Monte Carlo tab to run simulations directly in your browser — no API key needed.';
  }
}

// ── Monte Carlo ───────────────────────────────────────────────────────────────
function runSimulation() {
  const btn = document.getElementById('simBtn');
  if (btn) { btn.textContent = '↻ Running…'; btn.style.opacity = '0.6'; btn.disabled = true; }
  setTimeout(() => {
    const scenarioKey = document.getElementById('scenarioSelect')?.value || 'base';
    const scenario = MC.SCENARIOS[scenarioKey];
    const result = MC.run(10000, scenario.params);
    lastMCResult = result;
    renderSimulation(result, scenario);
    updateMetrics(result);
    renderTable();
    if (btn) { btn.textContent = '↻ Simulate'; btn.style.opacity = '1'; btn.disabled = false; }
  }, 50);
}

function renderSimulation(r, scenario) {
  const tCol = '#1db87b', bCol = '#f0960a';
  const el = document.getElementById('mcSummary');
  if (el) {
    el.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(115px,1fr));gap:10px;margin-bottom:12px">
        <div style="background:var(--bg3);border-radius:8px;padding:10px 12px">
          <div style="font-size:10px;color:var(--muted);font-family:'JetBrains Mono',monospace;text-transform:uppercase;margin-bottom:4px">TMC median</div>
          <div style="font-size:24px;font-weight:300;color:${tCol};font-family:'Playfair Display',serif">${r.tmcMean}</div>
          <div style="font-size:10px;color:var(--muted);margin-top:2px">90% CI: ${r.tmcRange}</div>
        </div>
        <div style="background:var(--bg3);border-radius:8px;padding:10px 12px">
          <div style="font-size:10px;color:var(--muted);font-family:'JetBrains Mono',monospace;text-transform:uppercase;margin-bottom:4px">BJP median</div>
          <div style="font-size:24px;font-weight:300;color:${bCol};font-family:'Playfair Display',serif">${r.bjpMean}</div>
          <div style="font-size:10px;color:var(--muted);margin-top:2px">90% CI: ${r.bjpRange}</div>
        </div>
        <div style="background:var(--bg3);border-radius:8px;padding:10px 12px">
          <div style="font-size:10px;color:var(--muted);font-family:'JetBrains Mono',monospace;text-transform:uppercase;margin-bottom:4px">TMC majority</div>
          <div style="font-size:24px;font-weight:300;color:${r.tmcMajorityProb>50?tCol:bCol};font-family:'Playfair Display',serif">${r.tmcMajorityProb}%</div>
          <div style="font-size:10px;color:var(--muted);margin-top:2px">probability</div>
        </div>
        <div style="background:var(--bg3);border-radius:8px;padding:10px 12px">
          <div style="font-size:10px;color:var(--muted);font-family:'JetBrains Mono',monospace;text-transform:uppercase;margin-bottom:4px">BJP majority</div>
          <div style="font-size:24px;font-weight:300;color:#6b7585;font-family:'Playfair Display',serif">${r.bjpMajorityProb}%</div>
          <div style="font-size:10px;color:var(--muted);margin-top:2px">probability</div>
        </div>
      </div>
      <div style="height:5px;background:var(--bg3);border-radius:5px;overflow:hidden;margin-bottom:4px">
        <div style="height:100%;width:${r.tmcMajorityProb}%;background:linear-gradient(90deg,${tCol},#5dcaa5);border-radius:5px;transition:width 0.8s ease"></div>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:10px;font-family:'JetBrains Mono',monospace;color:var(--muted)">
        <span style="color:${tCol}">TMC majority: ${r.tmcMajorityProb}%</span>
        <span style="color:${bCol}">BJP majority: ${r.bjpMajorityProb}%</span>
      </div>`;
  }
  drawHistogram(r);
  const desc = document.getElementById('mcScenarioDesc');
  if (desc) desc.innerHTML = `<strong style="color:var(--text)">${scenario.label}:</strong> ${scenario.desc}`;
  const upd = document.getElementById('mcUpdated');
  if (upd) upd.textContent = `${r.N.toLocaleString()} simulations · ${new Date().toLocaleTimeString('en-IN',{timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit'})} IST`;
}

function drawHistogram(r) {
  const canvas = document.getElementById('mcChart');
  if (!canvas || !r.histogram) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.offsetWidth || 600;
  canvas.width = W * dpr;
  canvas.height = 80 * dpr;
  ctx.scale(dpr, dpr);
  const H = 80;
  ctx.clearRect(0, 0, W, H);

  const bins = r.histogram;
  const maxF = Math.max(...bins.map(b => Math.max(b.tmcFreq, b.bjpFreq)));
  const bW = W / bins.length;

  bins.forEach((bin, i) => {
    const x = i * bW;
    // TMC
    const tH = (bin.tmcFreq / maxF) * (H - 18);
    const tG = ctx.createLinearGradient(0, H - 18 - tH, 0, H - 18);
    tG.addColorStop(0, 'rgba(29,184,123,0.85)');
    tG.addColorStop(1, 'rgba(29,184,123,0.25)');
    ctx.fillStyle = tG;
    ctx.fillRect(x + 1, H - 18 - tH, bW * 0.46, tH);
    // BJP
    const bH = (bin.bjpFreq / maxF) * (H - 18);
    const bG = ctx.createLinearGradient(0, H - 18 - bH, 0, H - 18);
    bG.addColorStop(0, 'rgba(240,150,10,0.85)');
    bG.addColorStop(1, 'rgba(240,150,10,0.25)');
    ctx.fillStyle = bG;
    ctx.fillRect(x + bW * 0.51, H - 18 - bH, bW * 0.46, bH);
  });

  // Majority line
  const majX = ((148 - 100) / 150) * W;
  ctx.strokeStyle = 'rgba(200,169,110,0.7)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 3]);
  ctx.beginPath(); ctx.moveTo(majX, 0); ctx.lineTo(majX, H - 18); ctx.stroke();
  ctx.setLineDash([]);

  // Median markers
  ctx.font = '10px JetBrains Mono, monospace';
  ctx.textAlign = 'center';
  const tmcX = Math.min(W - 22, Math.max(22, ((r.tmcMean - 100) / 150) * W));
  ctx.fillStyle = 'rgba(29,184,123,0.9)';
  ctx.fillRect(tmcX - 0.5, 0, 1.5, H - 18);
  ctx.fillText(r.tmcMean, tmcX, H - 4);

  const bjpX = Math.min(W - 22, Math.max(22, ((r.bjpMean - 100) / 150) * W));
  ctx.fillStyle = 'rgba(240,150,10,0.9)';
  ctx.fillRect(bjpX - 0.5, 0, 1.5, H - 18);
  ctx.fillText(r.bjpMean, bjpX, H - 4);
}

// ── Metrics ───────────────────────────────────────────────────────────────────
function computeCounts() {
  const c = {};
  SEATS.forEach(s => { c[s[3]] = (c[s[3]] || 0) + 1; });
  return c;
}

function animateNum(id, val) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = `<span class="number-tick">${val}</span>`;
}

function updateMetrics(mc) {
  const c = computeCounts();
  const tmcEl = document.getElementById('m-tmc');
  const bjpEl = document.getElementById('m-bjp');
  if (tmcEl) tmcEl.innerHTML = `<span class="number-tick">${mc ? mc.tmcRange : (c.TMC||0)}</span>`;
  if (bjpEl) bjpEl.innerHTML = `<span class="number-tick">${mc ? mc.bjpRange : (c.BJP||0)}</span>`;
  const oth = (c.BGPM||0)+(c.INC||0)+(c.LF||0);
  animateNum('m-oth', oth);
  animateNum('m-swing', c.SWING||0);
  const sub = document.getElementById('m-oth-sub');
  if (sub) sub.textContent = `BGPM·${c.BGPM||0}  INC·${c.INC||0}  LF·${c.LF||0}`;

  const total = 294;
  const tV = mc ? mc.tmcMean : (c.TMC||0);
  const bV = mc ? mc.bjpMean : (c.BJP||0);
  const oV = oth;
  const sV = Math.max(0, total - tV - bV - oV);

  [['sb-tmc',tV,'leg-tmc'],['sb-bjp',bV,'leg-bjp'],
   ['sb-bgpm',c.BGPM,'leg-bgpm'],['sb-inc',c.INC,'leg-inc'],
   ['sb-lf',c.LF,'leg-lf'],['sb-swing',sV,'leg-sw']
  ].forEach(([id,val,legId]) => {
    const v = val||0;
    const el = document.getElementById(id);
    if (el) { el.style.width=(v/total*100).toFixed(2)+'%'; el.textContent=v>=15?v:''; }
    const leg = document.getElementById(legId);
    if (leg) leg.textContent=`(${v})`;
  });
}

// ── Stage banner ──────────────────────────────────────────────────────────────
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
  if (['exit-polls-live','results-live'].includes(status.stage) && !document.getElementById('exitPollBanner')) {
    const b = document.createElement('div');
    b.id = 'exitPollBanner';
    b.style.cssText = 'background:rgba(240,150,10,0.1);border:1px solid rgba(240,150,10,0.35);border-radius:10px;padding:14px 20px;margin-bottom:24px;font-size:14px;font-weight:500;color:#f0d080;text-align:center;animation:fadeIn 0.4s ease';
    b.textContent = status.stage === 'results-live'
      ? '🗳️ RESULTS ARE BEING COUNTED — May 4, 2026. Simulations updating live.'
      : '📊 EXIT POLLS ARE LIVE. Simulations updated with exit poll data. Results: May 4.';
    document.querySelector('.hero')?.prepend(b);
  }
}

// ── News ──────────────────────────────────────────────────────────────────────
function renderNews(data) {
  const el = document.getElementById('newsFeed');
  if (!el) return;
  if (!data.items || data.items.length === 0) {
    el.innerHTML = '<div class="news-loading">No headlines right now.</div>';
    return;
  }
  el.innerHTML = data.items.slice(0,10).map(item => `
    <div class="news-item">
      <div class="news-title"><a href="${item.link}" target="_blank" rel="noopener">${item.title}</a></div>
      <div class="news-meta">${item.src||'News'}${item.pub?' · '+new Date(item.pub).toLocaleDateString('en-IN',{day:'2-digit',month:'short'}):''}</div>
    </div>`).join('');
  const age = document.getElementById('newsAge');
  if (age && data.fetchedAt) age.textContent = 'at '+new Date(data.fetchedAt).toLocaleTimeString('en-IN',{timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit'});
}

// ── District breakdown ────────────────────────────────────────────────────────
function buildDistrictBreakdown() {
  const dm = {};
  SEATS.forEach(s => {
    if (!dm[s[2]]) dm[s[2]] = {TMC:0,BJP:0,OTH:0};
    if (s[3]==='TMC') dm[s[2]].TMC++;
    else if (s[3]==='BJP') dm[s[2]].BJP++;
    else dm[s[2]].OTH++;
  });
  const el = document.getElementById('districtBreakdown');
  if (el) el.innerHTML = Object.entries(dm)
    .sort((a,b)=>(b[1].TMC+b[1].BJP)-(a[1].TMC+a[1].BJP))
    .map(([d,v])=>`
      <div class="district-row">
        <div class="district-name">${d}</div>
        <div class="district-seats">
          <span class="ds-tmc">T:${v.TMC}</span>
          <span class="ds-bjp">B:${v.BJP}</span>
          ${v.OTH>0?`<span style="color:var(--bgpm)">O:${v.OTH}</span>`:''}
        </div>
      </div>`).join('');
}

// ── Table ─────────────────────────────────────────────────────────────────────
function buildDistrictFilter() {
  const sel = document.getElementById('filterDistrict');
  if (!sel) return;
  [...new Set(SEATS.map(s=>s[2]))].sort().forEach(d => {
    const o = document.createElement('option');
    o.value=d; o.textContent=d; sel.appendChild(o);
  });
}

function filterTable() { renderTable(); }

function sortBy(key) {
  sortAsc = sortKey===key ? !sortAsc : true;
  sortKey = key;
  renderTable();
}

function renderTable() {
  const q  = (document.getElementById('searchInput')?.value||'').toLowerCase().trim();
  const fp = document.getElementById('filterParty')?.value||'';
  const fd = document.getElementById('filterDistrict')?.value||'';
  const fph= document.getElementById('filterPhase')?.value||'';
  const km = {no:0,name:1,district:2,winner:3,conf:6,phase:7};

  const list = SEATS
    .filter(s=>
      (!q||s[1].toLowerCase().includes(q)||s[4].toLowerCase().includes(q)||s[5].toLowerCase().includes(q))&&
      (!fp||s[3]===fp)&&(!fd||s[2]===fd)&&(!fph||s[7]===parseInt(fph))
    )
    .sort((a,b)=>{
      const ki=km[sortKey]??0;
      const va=a[ki],vb=b[ki];
      return sortAsc?(typeof va==='string'?va.localeCompare(vb):va-vb):(typeof va==='string'?vb.localeCompare(va):vb-va);
    });

  const tbody = document.getElementById('tblBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  list.forEach(s => {
    const [no,name,district,winner,tmc,bjp,conf,phase,cat] = s;
    const color = PARTY_COLORS[winner]||'#6b7585';

    // Get MC probability for this seat if available
    let mcProb = '';
    if (lastMCResult && lastMCResult.seatProbs[no]) {
      const sp = lastMCResult.seatProbs[no];
      const pct = winner==='BJP' ? sp.bjpProb : (winner==='BGPM' ? sp.bgpmProb : (winner==='INC' ? sp.incProb : sp.tmcProb));
      mcProb = `<span style="font-size:9px;font-family:'JetBrains Mono',monospace;color:${color};margin-left:4px">${pct}%</span>`;
    }

    const tr = document.createElement('tr');
    if (selectedRow===no) tr.classList.add('selected');
    tr.onclick = ()=>showDetail(no-1);
    tr.innerHTML = `
      <td><span class="seat-no">${no}</span></td>
      <td><span class="seat-name">${name}</span>${cat?`<span class="seat-cat"> ${cat}</span>`:''}</td>
      <td><span class="seat-district">${district}</span></td>
      <td><span class="winner-badge w-${winner.toLowerCase()}">${winner}</span>${mcProb}</td>
      <td><span class="cand-name" title="${tmc}">${tmc}</span></td>
      <td><span class="cand-name" title="${bjp}">${bjp}</span></td>
      <td><div class="conf-wrap">
        <span class="conf-num">${conf}%</span>
        <div class="conf-bar"><div class="conf-fill" style="width:${conf}%;background:${color}"></div></div>
      </div></td>
      <td><span class="phase-tag">Ph ${phase}</span></td>`;
    tbody.appendChild(tr);
  });

  const cnt = document.getElementById('tblCount');
  if (cnt) cnt.textContent = `${list.length} of ${SEATS.length} seats`;
}

// ── Detail panel ──────────────────────────────────────────────────────────────
function showDetail(idx) {
  const s = SEATS[idx];
  if (!s) return;
  const [no,name,district,winner,tmc,bjp,conf,phase,cat] = s;
  selectedRow = no;
  renderTable();

  const color = PARTY_COLORS[winner]||'#6b7585';
  document.getElementById('dp-name').textContent = name;
  document.getElementById('dp-meta').textContent =
    `#${no} · ${district}${cat?' · '+cat:''} · Phase ${phase} · Model confidence: ${conf}%`;

  // MC probabilities for this seat
  let mcInfo = '';
  if (lastMCResult && lastMCResult.seatProbs[no]) {
    const sp = lastMCResult.seatProbs[no];
    mcInfo = `
      <div style="background:var(--bg3);border-radius:8px;padding:12px;margin-bottom:10px">
        <div style="font-size:10px;color:var(--muted);font-family:'JetBrains Mono',monospace;text-transform:uppercase;margin-bottom:8px">Monte Carlo simulation (${lastMCResult.N.toLocaleString()} runs)</div>
        <div style="display:flex;gap:12px;flex-wrap:wrap">
          <span style="font-size:13px;color:#1db87b">TMC wins: <strong>${sp.tmcProb}%</strong></span>
          <span style="font-size:13px;color:#f0960a">BJP wins: <strong>${sp.bjpProb}%</strong></span>
          ${sp.bgpmProb>0?`<span style="font-size:13px;color:#8b7fe8">BGPM: <strong>${sp.bgpmProb}%</strong></span>`:''}
        </div>
        <div style="height:4px;background:var(--bg3);border-radius:4px;overflow:hidden;margin-top:8px">
          <div style="height:100%;width:${sp.tmcProb}%;background:#1db87b;border-radius:4px;transition:width 0.6s"></div>
        </div>
      </div>`;
  }

  document.getElementById('dp-grid').innerHTML = `
    ${mcInfo}
    <div class="detail-stat"><div class="detail-stat-label">Predicted winner</div>
      <div class="detail-stat-val" style="color:${color}">${winner}</div></div>
    <div class="detail-stat"><div class="detail-stat-label">Model confidence</div>
      <div class="detail-stat-val">${conf}%</div></div>
    <div class="detail-stat"><div class="detail-stat-label">TMC candidate</div>
      <div class="detail-stat-val" style="font-size:13px">${tmc}</div></div>
    <div class="detail-stat"><div class="detail-stat-label">BJP candidate</div>
      <div class="detail-stat-val" style="font-size:13px">${bjp}</div></div>`;

  document.getElementById('dp-reason').textContent = WINNER_REASONS[winner]||WINNER_REASONS.TMC;
  document.getElementById('dp-actions').innerHTML = `
    <button class="detail-btn" onclick="copyPrompt('Analyse ${name} constituency WB 2026: candidates, 2021 result, 2024 LS segment, local factors')">Copy analysis prompt</button>
    <button class="detail-btn" onclick="closeDetail()">Close</button>`;

  document.getElementById('detailPanel')?.classList.add('open');
  document.getElementById('detailPanel')?.scrollIntoView({behavior:'smooth',block:'nearest'});
}

function closeDetail() {
  document.getElementById('detailPanel')?.classList.remove('open');
  selectedRow = null;
  renderTable();
}

function copyPrompt(text) {
  navigator.clipboard?.writeText(text)
    .then(()=>showToast('Prompt copied to clipboard'))
    .catch(()=>showToast(text.substring(0,80)+'…'));
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 3000);
}

// ── Full refresh (news + status) ──────────────────────────────────────────────
async function fullRefresh() {
  const btn = document.getElementById('refreshBtn');
  if (btn) { btn.classList.add('spinning'); btn.textContent = '↻ Refreshing…'; }

  try {
    const [news, status] = await Promise.allSettled([
      fetch(`${API}/api/news`).then(r=>r.json()),
      fetch(`${API}/api/status`).then(r=>r.json()),
    ]);
    if (news.status==='fulfilled') renderNews(news.value);
    if (status.status==='fulfilled') updateStageBanner(status.value);
    showToast('News updated');
  } catch(e) { /* silent */ }

  if (btn) { btn.classList.remove('spinning'); btn.textContent = '↻ Refresh'; }
}

// Soft background pull every 5 min for news
setInterval(async () => {
  try {
    const [news, status] = await Promise.allSettled([
      fetch(`${API}/api/news`).then(r=>r.json()),
      fetch(`${API}/api/status`).then(r=>r.json()),
    ]);
    if (news.status==='fulfilled') renderNews(news.value);
    if (status.status==='fulfilled') updateStageBanner(status.value);
  } catch(e) {}
}, 5 * 60 * 1000);

// ── Init ──────────────────────────────────────────────────────────────────────
function init() {
  buildDistrictFilter();
  updateMetrics(null);
  renderTable();
  buildDistrictBreakdown();
  // Start on AI tab — load AI analysis
  switchTab('ai');
  refreshAI();
  // Fetch news and status
  fetch(`${API}/api/news`).then(r=>r.json()).then(renderNews).catch(()=>{});
  fetch(`${API}/api/status`).then(r=>r.json()).then(updateStageBanner).catch(()=>{});
}

document.addEventListener('DOMContentLoaded', init);
