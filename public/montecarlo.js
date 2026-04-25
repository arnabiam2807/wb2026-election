// ─────────────────────────────────────────────────────────────────────────────
// WEST BENGAL 2026 — MONTE CARLO ELECTION SIMULATION ENGINE
// Runs 10,000 simulations entirely in browser. No API. No surveys.
// Based on: 2021 results, 2024 LS segments, demographics, SIR, anti-incumbency
// ─────────────────────────────────────────────────────────────────────────────

const MC = (() => {

  // ── District-level parameters ─────────────────────────────────────────────
  // Base swing adjustments per district vs 2021 baseline
  // Positive = BJP gains, Negative = TMC gains
  // Sources: 2024 LS results, Phase 1 turnout, SIR data, demographic analysis
  const DISTRICT_PARAMS = {
    // North Bengal — BJP surge territory
    'Cooch Behar':        { bjpSwing: +6,  sirImpact: -2, turnoutSignal: +3, musliPct: 25 },
    'Alipurduar':         { bjpSwing: +5,  sirImpact: -1, turnoutSignal: +3, musliPct: 12 },
    'Jalpaiguri':         { bjpSwing: +4,  sirImpact: -1, turnoutSignal: +2, musliPct: 15 },
    'Kalimpong':          { bjpSwing: -5,  sirImpact: 0,  turnoutSignal: 0,  musliPct: 5  }, // BGPM ally
    'Darjeeling':         { bjpSwing: -3,  sirImpact: 0,  turnoutSignal: +1, musliPct: 5  }, // BGPM ally
    'Uttar Dinajpur':     { bjpSwing: +2,  sirImpact: -5, turnoutSignal: +2, musliPct: 50 }, // High Muslim, SIR impact
    'Dakshin Dinajpur':   { bjpSwing: +4,  sirImpact: -3, turnoutSignal: +5, musliPct: 30 }, // Highest turnout
    'Malda':              { bjpSwing: +3,  sirImpact: -4, turnoutSignal: +3, musliPct: 51 }, // High Muslim
    // Murshidabad — Muslim fortress + JUP factor
    'Murshidabad':        { bjpSwing: +2,  sirImpact: -6, turnoutSignal: +3, musliPct: 66, jupFactor: +4 },
    // Matua belt — BJP gains from CAA
    'Nadia':              { bjpSwing: +5,  sirImpact: -3, turnoutSignal: +2, musliPct: 28, matuaFactor: +6 },
    'North 24 Parganas':  { bjpSwing: +3,  sirImpact: -2, turnoutSignal: +2, musliPct: 30, matuaFactor: +4 },
    // South Bengal — TMC fortress
    'South 24 Parganas':  { bjpSwing: +2,  sirImpact: -2, turnoutSignal: +1, musliPct: 35 },
    'Kolkata':            { bjpSwing: +3,  sirImpact: -1, turnoutSignal: +2, musliPct: 20, rgKarFactor: +3 },
    'Howrah':             { bjpSwing: +2,  sirImpact: -1, turnoutSignal: +1, musliPct: 22 },
    'Hooghly':            { bjpSwing: +3,  sirImpact: -1, turnoutSignal: +2, musliPct: 18 },
    // Medinipur area — Suvendu territory
    'Purba Medinipur':    { bjpSwing: +4,  sirImpact: -1, turnoutSignal: +2, musliPct: 15 },
    'Paschim Medinipur':  { bjpSwing: +3,  sirImpact: -1, turnoutSignal: +2, musliPct: 18 },
    'Jhargram':           { bjpSwing: +2,  sirImpact: -1, turnoutSignal: +1, musliPct: 10 },
    // Jangalmahal
    'Purulia':            { bjpSwing: +5,  sirImpact: -1, turnoutSignal: +2, musliPct: 8  },
    'Bankura':            { bjpSwing: +3,  sirImpact: -1, turnoutSignal: +2, musliPct: 10 },
    // Bardhaman
    'Purba Bardhaman':    { bjpSwing: +2,  sirImpact: -2, turnoutSignal: +1, musliPct: 22 },
    'Paschim Bardhaman':  { bjpSwing: +4,  sirImpact: -1, turnoutSignal: +2, musliPct: 18 }, // Coal belt anger
    // Birbhum — TMC fortress
    'Birbhum':            { bjpSwing: +1,  sirImpact: -3, turnoutSignal: +1, musliPct: 37 },
  };

  // ── Seat-level base probabilities ─────────────────────────────────────────
  // Convert confidence score + winner into TMC win probability
  // Accounts for: 2021 margin, 2024 swing, candidate strength
  function baseTMCProbability(seat) {
    const [no, name, district, winner, tmc, bjp, conf, phase, cat] = seat;

    // Start from stated confidence
    let prob;
    switch(winner) {
      case 'TMC':   prob = conf / 100; break;           // e.g. 65% conf = 0.65 TMC wins
      case 'BJP':   prob = 1 - (conf / 100); break;     // e.g. 65% conf BJP = 0.35 TMC wins
      case 'BGPM':  prob = 1 - (conf / 100); break;     // TMC ally, BGPM wins = TMC coalition wins
      case 'INC':   prob = 0.30; break;                  // INC = low TMC probability
      case 'LF':    prob = 0.25; break;                  // LF = very low TMC
      case 'SWING': prob = 0.50 + (conf - 50) * 0.01; break; // Swing = near 50/50
      default:      prob = 0.50;
    }

    // Clamp to [0.05, 0.95]
    return Math.max(0.05, Math.min(0.95, prob));
  }

  // ── Apply scenario adjustments ────────────────────────────────────────────
  function adjustedProbability(seat, scenario) {
    const [no, name, district, winner, tmc, bjp, conf, phase, cat] = seat;
    let prob = baseTMCProbability(seat);
    const dp = DISTRICT_PARAMS[district] || { bjpSwing: 0, sirImpact: 0, turnoutSignal: 0, musliPct: 20 };

    // Apply district swing — scaled by scenario severity
    const swingScale = scenario.swingIntensity;
    prob -= (dp.bjpSwing * swingScale) / 100;

    // SIR impact — reduced Muslim voter turnout hurts TMC
    const sirScale = scenario.sirSeverity;
    prob += (dp.sirImpact * sirScale) / 100;  // negative = hurts TMC

    // Turnout signal — high turnout = anti-incumbency signal
    const turnoutScale = scenario.turnoutImpact;
    prob -= (dp.turnoutSignal * turnoutScale) / 100;

    // Welfare scheme loyalty — dampens anti-incumbency
    const welfareBoost = scenario.welfareRetention;
    if (cat === 'SC' || cat === 'ST') prob += (0.02 * welfareBoost); // SC/ST benefit from Lakshmir Bhandar
    if (dp.musliPct > 40) prob += (0.015 * welfareBoost); // High Muslim seats TMC welfare strong

    // JUP factor in Murshidabad — splits Muslim vote
    if (dp.jupFactor && district === 'Murshidabad') {
      prob -= (dp.jupFactor * scenario.jupStrength) / 100;
    }

    // Matua factor — CAA resonance in Nadia/North 24P SC seats
    if (dp.matuaFactor && cat === 'SC' && (district === 'Nadia' || district === 'North 24 Parganas')) {
      prob -= (dp.matuaFactor * scenario.matuaSwing) / 100;
    }

    // RG Kar factor in Kolkata
    if (dp.rgKarFactor && district === 'Kolkata') {
      prob -= (dp.rgKarFactor * scenario.rgKarImpact) / 100;
    }

    // Bengali asmita factor — TMC's "Bengal vs Delhi" narrative
    prob += scenario.asmiataBoost / 100;

    // Clamp to [0.03, 0.97]
    return Math.max(0.03, Math.min(0.97, prob));
  }

  // ── Single simulation run ─────────────────────────────────────────────────
  function runOnce(scenario) {
    const results = { TMC: 0, BJP: 0, BGPM: 0, INC: 0, LF: 0, OTHER: 0 };
    const seatResults = [];

    for (const seat of SEATS) {
      const [no, name, district, winner, tmc, bjp, conf, phase, cat] = seat;
      const tmcProb = adjustedProbability(seat, scenario);

      // Add seat-level random noise (±3% std dev for local factors)
      const noise = gaussianRandom(0, 0.03);
      const finalProb = Math.max(0.01, Math.min(0.99, tmcProb + noise));

      const rand = Math.random();
      let result;

      if (winner === 'BGPM') {
        // BGPM wins unless BJP has massive wave
        result = rand < 0.85 ? 'BGPM' : 'BJP';
      } else if (winner === 'INC') {
        // INC in Baharampur — holds unless TMC consolidation
        result = rand < 0.65 ? 'INC' : (rand < 0.80 ? 'TMC' : 'BJP');
      } else {
        result = rand < finalProb ? 'TMC' : 'BJP';
      }

      results[result] = (results[result] || 0) + 1;
      seatResults.push({ no, result, prob: finalProb });
    }

    return { results, seatResults };
  }

  // ── Gaussian random number (Box-Muller) ───────────────────────────────────
  function gaussianRandom(mean, std) {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return mean + std * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  // ── Full Monte Carlo run ──────────────────────────────────────────────────
  function run(N = 10000, scenario = null) {
    const defaultScenario = {
      swingIntensity:  1.0,   // BJP district swing multiplier
      sirSeverity:     1.0,   // SIR voter deletion impact
      turnoutImpact:   1.0,   // High turnout = anti-incumbency
      welfareRetention:1.0,   // TMC welfare loyalty retention
      jupStrength:     1.0,   // JUP Muslim vote split in Murshidabad
      matuaSwing:      1.0,   // Matua BJP swing in Nadia/North 24P
      rgKarImpact:     0.5,   // RG Kar case anti-TMC in Kolkata
      asmiataBoost:    1.5,   // Bengali identity TMC boost
    };
    const s = { ...defaultScenario, ...(scenario || {}) };

    const tmcCounts = new Array(295).fill(0);   // tmcCounts[i] = times TMC won i seats
    const bjpCounts = new Array(295).fill(0);
    const seatWins = {};  // seatWins[no] = {TMC: X, BJP: Y, total: N}

    // Init seat wins
    for (const seat of SEATS) {
      seatWins[seat[0]] = { TMC: 0, BJP: 0, BGPM: 0, INC: 0, OTHER: 0 };
    }

    let tmcTotal = 0, bjpTotal = 0;

    for (let i = 0; i < N; i++) {
      const { results, seatResults } = runOnce(s);
      const tmc = results.TMC + (results.BGPM || 0); // count BGPM as TMC alliance
      const bjp = results.BJP || 0;
      tmcCounts[tmc]++;
      bjpCounts[bjp]++;
      tmcTotal += tmc;
      bjpTotal += bjp;

      for (const sr of seatResults) {
        if (seatWins[sr.no]) {
          seatWins[sr.no][sr.result] = (seatWins[sr.no][sr.result] || 0) + 1;
        }
      }
    }

    // ── Compute statistics ─────────────────────────────────────────────────
    const tmcMean = tmcTotal / N;
    const bjpMean = bjpTotal / N;

    // TMC majority probability
    const tmcMajorityProb = tmcCounts.slice(148).reduce((a, b) => a + b, 0) / N;

    // Confidence intervals (5th and 95th percentile)
    let cumTMC = 0, tmcLow = 0, tmcHigh = 0;
    for (let i = 0; i <= 294; i++) {
      cumTMC += tmcCounts[i];
      if (cumTMC / N >= 0.05 && tmcLow === 0) tmcLow = i;
      if (cumTMC / N >= 0.95 && tmcHigh === 0) { tmcHigh = i; break; }
    }

    let cumBJP = 0, bjpLow = 0, bjpHigh = 0;
    for (let i = 0; i <= 294; i++) {
      cumBJP += bjpCounts[i];
      if (cumBJP / N >= 0.05 && bjpLow === 0) bjpLow = i;
      if (cumBJP / N >= 0.95 && bjpHigh === 0) { bjpHigh = i; break; }
    }

    // Per-seat win probability
    const seatProbs = {};
    for (const seat of SEATS) {
      const sw = seatWins[seat[0]];
      seatProbs[seat[0]] = {
        tmcProb: Math.round((sw.TMC || 0) / N * 100),
        bjpProb: Math.round((sw.BJP || 0) / N * 100),
        bgpmProb: Math.round((sw.BGPM || 0) / N * 100),
        incProb: Math.round((sw.INC || 0) / N * 100),
        predicted: getPredicted(sw, N),
      };
    }

    // Distribution histogram (group into bins of 5)
    const histogram = [];
    for (let i = 100; i <= 250; i += 5) {
      histogram.push({
        seats: i,
        tmcFreq: tmcCounts.slice(i, i + 5).reduce((a, b) => a + b, 0) / N,
        bjpFreq: bjpCounts.slice(i, i + 5).reduce((a, b) => a + b, 0) / N,
      });
    }

    return {
      N,
      tmcMean: Math.round(tmcMean),
      bjpMean: Math.round(bjpMean),
      tmcRange: `${tmcLow}–${tmcHigh}`,
      bjpRange: `${bjpLow}–${bjpHigh}`,
      tmcMajorityProb: Math.round(tmcMajorityProb * 100),
      bjpMajorityProb: Math.round((1 - tmcMajorityProb) * 100),
      histogram,
      seatProbs,
      tmcCounts,
      bjpCounts,
      scenario: s,
      runAt: new Date().toISOString(),
    };
  }

  function getPredicted(sw, N) {
    const entries = Object.entries(sw).filter(([k]) => k !== 'OTHER');
    entries.sort((a, b) => b[1] - a[1]);
    return entries[0][0];
  }

  // ── Scenario presets ──────────────────────────────────────────────────────
  const SCENARIOS = {
    base: {
      label: 'Base case',
      desc: 'Current signals, balanced assumptions',
      params: {},
    },
    tmcWave: {
      label: 'TMC wave',
      desc: 'Bengali asmita resonates, BJP underperforms, welfare loyalty strong',
      params: { swingIntensity: 0.4, welfareRetention: 1.5, asmiataBoost: 4, sirSeverity: 0.5, turnoutImpact: 0.5 },
    },
    bjpSurge: {
      label: 'BJP surge',
      desc: 'Record turnout = anti-incumbency wave, SIR bites hard, Matua consolidates',
      params: { swingIntensity: 1.6, sirSeverity: 1.5, turnoutImpact: 1.6, matuaSwing: 1.5, welfareRetention: 0.6, asmiataBoost: 0 },
    },
    hung: {
      label: 'Hung assembly',
      desc: 'Tight race, JUP splits Muslim votes, BJP surges to near-majority',
      params: { swingIntensity: 1.3, jupStrength: 1.8, sirSeverity: 1.3, matuaSwing: 1.3, turnoutImpact: 1.3, welfareRetention: 0.8 },
    },
  };

  return { run, SCENARIOS, baseTMCProbability, adjustedProbability, DISTRICT_PARAMS };

})();
