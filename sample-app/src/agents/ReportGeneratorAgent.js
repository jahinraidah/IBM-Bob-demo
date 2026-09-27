/**
 * ReportGeneratorAgent
 *
 * Renders findings as styled HTML using the reference repo's
 * watch / ask / stop level system with plain-language "What you can say" counters.
 * Supports two-tier negotiation (tryFirst / ifPushback), leverage, walkAway, and excerpt.
 */

const LEVEL_LABEL   = { stop: 'PAUSE BEFORE SIGNING', ask: 'ASK TO CHANGE', watch: 'WATCH' }
const LEVEL_TITLE   = { stop: 'Stop here.', ask: 'Negotiate this one.', watch: 'Noted. Not urgent.' }
const LEVEL_MEANING = {
  stop:  "This clause carries real risk. Don't sign until it's addressed.",
  ask:   'As written, it favors the other side. Ask for a fairer version.',
  watch: 'Keep an eye on it — nothing needs to change right now.',
}

const TONE_COLOR = {
  stop:  { text: '#f0a090', bg: 'rgba(240,160,144,0.12)', border: 'rgba(240,160,144,0.30)' },
  ask:   { text: '#e8c37a', bg: 'rgba(232,195,122,0.12)', border: 'rgba(232,195,122,0.30)' },
  watch: { text: '#c9d4e0', bg: 'rgba(201,212,224,0.10)', border: 'rgba(201,212,224,0.30)' },
}

// Map legacy risk levels from RiskAnalyzerAgent to new levels
function mapLevel(level) {
  if (!level) return 'watch'
  const l = level.toLowerCase()
  if (l === 'high' || l === 'pause before signing') return 'stop'
  if (l === 'medium' || l === 'ask to change')       return 'ask'
  if (l === 'low' || l === 'watch')                  return 'watch'
  if (l === 'stop' || l === 'ask' || l === 'watch')  return l
  return 'watch'
}

export function ReportGeneratorAgent({ filename, pageCount, findings, error }) {
  if (error) {
    return `<div style="font-family:'Source Sans 3','Segoe UI',system-ui,sans-serif;color:#e8eef6;padding:4px 0">
  <div style="font-size:11px;font-weight:700;color:#f0a090;letter-spacing:1.2px;text-transform:uppercase;margin-bottom:10px">Extraction Error</div>
  <p style="margin:0;font-size:13px;color:#8fa3b8;line-height:1.6">${error}</p>
</div>`
  }

  const mapped = findings.map(f => ({ ...f, level: mapLevel(f.level) }))

  const stopCount  = mapped.filter(f => f.level === 'stop').length
  const askCount   = mapped.filter(f => f.level === 'ask').length
  const watchCount = mapped.filter(f => f.level === 'watch').length
  const total      = mapped.length

  const SANS = "font-family:'Source Sans 3','Segoe UI',system-ui,sans-serif"

  // ── Overall summary ────────────────────────────────────────────────────────
  const overall = total === 0
    ? ''
    : `<div style="${SANS};background:rgba(18,38,61,1);border:1px solid rgba(232,238,246,0.12);border-radius:12px;padding:12px 16px;margin-bottom:16px">
        <div style="font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:#6b8299;margin-bottom:6px">HERE'S WHAT WE FOUND</div>
        <div style="font-size:0.93rem;color:#e8eef6;line-height:1.5">▶ <strong>${filename}</strong> · ${pageCount} page${pageCount !== 1 ? 's' : ''} · ${total} clause${total !== 1 ? 's' : ''} need${total === 1 ? 's' : ''} your attention</div>
       </div>`

  // ── Stat chips ─────────────────────────────────────────────────────────────
  const chips = total > 0 ? `
<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">
  ${stopCount  > 0 ? `<span style="${SANS};display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:99px;border:1px solid rgba(240,160,144,0.30);background:rgba(240,160,144,0.12);color:#f0a090;font-size:0.78rem;font-weight:600">${stopCount} STOP</span>` : ''}
  ${askCount   > 0 ? `<span style="${SANS};display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:99px;border:1px solid rgba(232,195,122,0.30);background:rgba(232,195,122,0.12);color:#e8c37a;font-size:0.78rem;font-weight:600">${askCount} NEGOTIATE</span>` : ''}
  ${watchCount > 0 ? `<span style="${SANS};display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:99px;border:1px solid rgba(201,212,224,0.30);background:rgba(201,212,224,0.10);color:#c9d4e0;font-size:0.78rem;font-weight:600">${watchCount} WATCH</span>` : ''}
</div>` : ''

  // ── Finding cards ──────────────────────────────────────────────────────────
  const list = total === 0
    ? `<div style="padding:20px 0;text-align:center">
         <div style="${SANS};font-size:1.05rem;font-weight:600;color:#e8eef6;margin-bottom:6px">Nothing concerning.</div>
         <div style="${SANS};font-size:0.87rem;color:#6b8299">// this contract looks well-balanced on the clauses we scan for</div>
       </div>`
    : `<ul style="list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:12px">
${mapped.map(({ term, level, note, eq, tryFirst, ifPushback, negotiate, leverage, walkAway, excerpt, matchCount }) => {
  const t = TONE_COLOR[level]
  // Two-tier: prefer new fields, fall back to legacy negotiate
  const tier1 = tryFirst || negotiate || ''
  const tier2 = ifPushback || ''
  return `
  <li style="border-radius:12px;border:1px solid rgba(232,238,246,0.12);background:rgba(11,24,41,1);padding:16px">
    <div style="display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-bottom:6px">
      <span style="${SANS};display:inline-flex;height:26px;align-items:center;padding:0 10px;border-radius:99px;border:1px solid ${t.border};background:${t.bg};color:${t.text};font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em">${LEVEL_LABEL[level]}</span>
      ${matchCount ? `<span style="${SANS};font-size:0.72rem;color:#6b8299;margin-left:auto">${matchCount}× found</span>` : ''}
    </div>
    <h3 style="${SANS};font-size:1rem;font-weight:700;color:${t.text};margin:0 0 2px;line-height:1.3">${LEVEL_TITLE[level]}</h3>
    <p style="${SANS};font-size:0.8rem;color:#6b8299;margin:0 0 8px;line-height:1.4">${LEVEL_MEANING[level]}</p>
    <h4 style="${SANS};font-size:1rem;font-weight:600;color:#e8eef6;margin:0;line-height:1.4">${term}</h4>
    <p style="${SANS};margin-top:6px;font-size:0.9rem;line-height:1.65;color:#8fa3b8">${note}</p>

    ${excerpt ? `<div style="margin-top:10px;padding:8px 12px;border-radius:8px;border-left:2px solid rgba(62,196,214,0.25);background:rgba(0,0,0,0.18)">
      <p style="${SANS};font-size:0.62rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#6b8299;margin-bottom:4px">From your document</p>
      <p style="${SANS};font-size:0.83rem;font-style:italic;color:#7a96ad;line-height:1.6;margin:0">"${excerpt.replace(/"/g, '&quot;')}"</p>
    </div>` : ''}

    ${eq ? `<div style="margin-top:10px;padding:8px 12px;border-radius:8px;border-left:2px solid rgba(62,196,214,0.4);background:rgba(0,0,0,0.15)">
      <p style="${SANS};font-size:0.62rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#6b8299;margin-bottom:4px">EQ Read</p>
      <p style="${SANS};font-size:0.88rem;font-style:italic;color:#8fa3b8;line-height:1.6;margin:0">${eq}</p>
    </div>` : ''}

    ${leverage ? `<div style="margin-top:8px;padding:6px 12px;border-radius:8px;background:rgba(0,0,0,0.12)">
      <p style="${SANS};font-size:0.62rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#6b8299;margin-bottom:3px">Leverage</p>
      <p style="${SANS};font-size:0.84rem;color:#8fa3b8;line-height:1.55;margin:0">${leverage}</p>
    </div>` : ''}

    ${tier1 ? `<div style="margin-top:10px;border-radius:8px;border:1px solid rgba(232,238,246,0.12);background:rgba(14,30,51,1);padding:10px 12px">
      <p style="${SANS};font-size:0.62rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#6b8299;margin-bottom:6px">What you can say</p>
      <p style="${SANS};font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#6b8299;margin-bottom:3px">Try this first</p>
      <p style="${SANS};font-size:0.88rem;font-style:italic;line-height:1.65;color:#e8eef6;margin:0 0 ${tier2 ? '10px' : '0'}">"${tier1}"</p>
      ${tier2 ? `<p style="${SANS};font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#6b8299;margin-bottom:3px">If they push back</p>
      <p style="${SANS};font-size:0.88rem;font-style:italic;line-height:1.65;color:#c9d4e0;margin:0">"${tier2}"</p>` : ''}
    </div>` : ''}

    ${walkAway ? `<p style="${SANS};margin-top:8px;font-size:0.8rem;line-height:1.5;color:#6b8299;padding-left:2px">⚑ ${walkAway}</p>` : ''}
  </li>`}).join('')}
</ul>`

  // ── Disclaimer ─────────────────────────────────────────────────────────────
  const disclaimer = `
<p style="margin-top:16px;font-size:0.78rem;color:#6b8299;border-top:1px solid rgba(232,238,246,0.08);padding-top:12px;${SANS};line-height:1.6;font-style:italic">
  // Informational only — not legal advice. Consult a qualified attorney before signing.
</p>`

  return `<div style="${SANS};max-width:100%;color:#e8eef6">${overall}${chips}${list}${disclaimer}</div>`
}
