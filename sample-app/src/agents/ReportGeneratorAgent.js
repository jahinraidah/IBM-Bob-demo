/**
 * ReportGeneratorAgent
 *
 * Receives the output of RiskAnalyzerAgent. Formats findings into a clean
 * HTML list report styled for the dark terminal panel.
 *
 * Returns: HTML string
 */

const LEVEL_COLOR  = { High: '#ff4d6d', Medium: '#ffaa00', Low: '#00d9ff' }
const LEVEL_BG     = { High: 'rgba(255,77,109,0.12)',  Medium: 'rgba(255,170,0,0.12)',  Low: 'rgba(0,217,255,0.10)' }
const LEVEL_BORDER = { High: 'rgba(255,77,109,0.35)',  Medium: 'rgba(255,170,0,0.35)',  Low: 'rgba(0,217,255,0.30)' }

const BASE = "font-family:'Baskerville Old Face','Baskerville',Georgia,serif"

export function ReportGeneratorAgent({ filename, pageCount, findings, error }) {
  if (error) {
    return `
<div style="${BASE};color:#e8f4ff;padding:4px 0">
  <div style="font-size:11px;font-weight:600;color:#ff4d6d;letter-spacing:1.2px;text-transform:uppercase;margin-bottom:10px">
    Extraction Error
  </div>
  <p style="margin:0;font-size:13px;color:#7a8fa8;font-family:ui-monospace,Consolas,monospace;line-height:1.6">
    // ${error}
  </p>
</div>`
  }

  const highCount = findings.filter((f) => f.level === 'High').length
  const medCount  = findings.filter((f) => f.level === 'Medium').length
  const lowCount  = findings.filter((f) => f.level === 'Low').length
  const total     = findings.length

  const overallRisk  = highCount >= 1 ? 'High' : medCount >= 1 ? 'Medium' : 'Low'
  const overallColor = LEVEL_COLOR[total === 0 ? 'Low' : overallRisk]

  // ── Header ────────────────────────────────────────────────────────────────
  const header = `
<div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:18px;flex-wrap:wrap;gap:10px">
  <div>
    <div style="font-size:11px;font-weight:600;color:#00d9ff;letter-spacing:1.2px;text-transform:uppercase;margin-bottom:5px">
      Analysis Complete
    </div>
    <p style="margin:0;font-size:12.5px;color:#7a8fa8;font-family:ui-monospace,Consolas,monospace">
      <span style="color:#00d9ff">▶</span> ${filename}
      &nbsp;·&nbsp; ${pageCount} page${pageCount !== 1 ? 's' : ''}
      &nbsp;·&nbsp; ${total} clause${total !== 1 ? 's' : ''} flagged
    </p>
  </div>
  ${total > 0 ? `
  <div style="padding:8px 16px;border-radius:8px;background:${LEVEL_BG[overallRisk]};border:1px solid ${LEVEL_BORDER[overallRisk]};text-align:center;flex-shrink:0">
    <div style="font-size:10px;color:#7a8fa8;letter-spacing:0.8px;text-transform:uppercase;margin-bottom:2px">Overall Risk</div>
    <div style="font-size:18px;font-weight:700;color:${overallColor};text-shadow:0 0 12px ${overallColor}88">${overallRisk}</div>
  </div>` : ''}
</div>`

  // ── Stat tiles ────────────────────────────────────────────────────────────
  const stats = total > 0 ? `
<div style="display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap">
  <div style="flex:1;min-width:64px;padding:10px 12px;border-radius:8px;background:rgba(255,77,109,0.1);border:1px solid rgba(255,77,109,0.3);text-align:center">
    <div style="font-size:20px;font-weight:700;color:#ff4d6d;text-shadow:0 0 10px #ff4d6d66">${highCount}</div>
    <div style="font-size:10px;color:#ff4d6d99;letter-spacing:0.5px;text-transform:uppercase">High</div>
  </div>
  <div style="flex:1;min-width:64px;padding:10px 12px;border-radius:8px;background:rgba(255,170,0,0.1);border:1px solid rgba(255,170,0,0.3);text-align:center">
    <div style="font-size:20px;font-weight:700;color:#ffaa00;text-shadow:0 0 10px #ffaa0066">${medCount}</div>
    <div style="font-size:10px;color:#ffaa0099;letter-spacing:0.5px;text-transform:uppercase">Medium</div>
  </div>
  <div style="flex:1;min-width:64px;padding:10px 12px;border-radius:8px;background:rgba(0,217,255,0.08);border:1px solid rgba(0,217,255,0.25);text-align:center">
    <div style="font-size:20px;font-weight:700;color:#00d9ff;text-shadow:0 0 10px #00d9ff55">${lowCount}</div>
    <div style="font-size:10px;color:#00d9ff99;letter-spacing:0.5px;text-transform:uppercase">Low</div>
  </div>
</div>` : ''

  // ── Findings list ─────────────────────────────────────────────────────────
  const list = total === 0
    ? `<div style="padding:20px 0;text-align:center">
         <div style="font-size:28px;margin-bottom:8px">✅</div>
         <div style="font-size:14px;font-weight:600;color:#e8f4ff;margin-bottom:4px">No risky clauses detected</div>
         <div style="font-size:12px;color:#7a8fa8;font-family:ui-monospace,Consolas,monospace">
           // none of the 5 monitored patterns were found in this document
         </div>
       </div>`
    : `<ul style="list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px">
        ${findings.map(({ term, level, note, matchCount }) => `
        <li style="border-radius:8px;background:${LEVEL_BG[level]};border:1px solid ${LEVEL_BORDER[level]};padding:12px 14px">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px;flex-wrap:wrap">
            <span style="font-family:ui-monospace,Consolas,monospace;font-size:13px;font-weight:500;color:#e8f4ff">${term}</span>
            <div style="display:flex;align-items:center;gap:8px;flex-shrink:0">
              <span style="font-size:10px;color:#7a8fa8;font-family:ui-monospace,Consolas,monospace">${matchCount} match${matchCount !== 1 ? 'es' : ''}</span>
              <span style="display:inline-block;padding:2px 9px;border-radius:99px;font-size:10.5px;font-weight:700;letter-spacing:0.5px;
                background:${LEVEL_BG[level]};color:${LEVEL_COLOR[level]};border:1px solid ${LEVEL_BORDER[level]};
                text-shadow:0 0 8px ${LEVEL_COLOR[level]}66">${level.toUpperCase()}</span>
            </div>
          </div>
          <p style="margin:0;font-size:12.5px;color:#7a8fa8;line-height:1.55">${note}</p>
        </li>`).join('')}
      </ul>`

  // ── Footer ────────────────────────────────────────────────────────────────
  const footer = `
<p style="margin-top:16px;font-size:11px;color:#4a6070;border-top:1px solid rgba(255,255,255,0.06);
   padding-top:12px;font-family:ui-monospace,Consolas,monospace;line-height:1.6">
  // Informational only — not legal advice. Consult a qualified attorney before signing.
</p>`

  return `<div style="${BASE};max-width:100%;color:#e8f4ff">${header}${stats}${list}${footer}</div>`
}
