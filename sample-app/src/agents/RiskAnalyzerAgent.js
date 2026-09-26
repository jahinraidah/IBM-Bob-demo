/**
 * RiskAnalyzerAgent
 *
 * Receives the output of ExtractorAgent. Performs a case-insensitive substring
 * scan of the extracted text against a fixed list of 5 dangerous clauses.
 *
 * Returns: { filename, findings, pageCount, error? }
 *   findings: Array<{ term, level, note, matchCount }>
 */

const RISKY_CLAUSES = [
  {
    term: 'unlimited liability',
    patterns: ['unlimited liability'],
    level: 'High',
    note: 'Exposes you to losses with no financial ceiling — you could owe far more than the contract is worth.',
  },
  {
    term: 'non-compete',
    patterns: ['non-compete', 'non compete', 'noncompete'],
    level: 'High',
    note: 'May legally bar you from working with competitors or in your industry after the contract ends.',
  },
  {
    term: 'auto-renewal',
    patterns: ['auto-renew', 'auto renew', 'automatically renew', 'automatic renewal'],
    level: 'Medium',
    note: 'Contract silently extends unless cancelled — often with a narrow cancellation window.',
  },
  {
    term: 'indemnification',
    patterns: ['indemnif'],
    level: 'High',
    note: 'You may be required to pay legal costs and damages on behalf of the other party for third-party claims.',
  },
  {
    term: 'unilateral modification',
    patterns: ['unilateral', 'modify at any time', 'change at any time', 'sole discretion'],
    level: 'Medium',
    note: 'The other party can alter contract terms without your consent.',
  },
]

export function RiskAnalyzerAgent({ filename, text, pageCount, error }) {
  if (error) {
    return { filename, pageCount: 0, findings: [], error }
  }

  const lower = text.toLowerCase()

  const findings = RISKY_CLAUSES.reduce((acc, clause) => {
    const matchCount = clause.patterns.reduce((n, pat) => {
      let count = 0
      let pos = 0
      while ((pos = lower.indexOf(pat, pos)) !== -1) {
        count++
        pos += pat.length
      }
      return n + count
    }, 0)

    if (matchCount > 0) {
      acc.push({ term: clause.term, level: clause.level, note: clause.note, matchCount })
    }
    return acc
  }, [])

  // Sort by severity: High first, then Medium, then Low
  const order = { High: 0, Medium: 1, Low: 2 }
  findings.sort((a, b) => order[a.level] - order[b.level])

  return { filename, pageCount, findings }
}
