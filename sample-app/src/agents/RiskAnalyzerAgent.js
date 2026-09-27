/**
 * RiskAnalyzerAgent
 *
 * Scans extracted text against risky clause patterns.
 * Each finding includes:
 *   - level        — High / Medium / Low
 *   - note         — what the clause means in plain language
 *   - eq           — emotional-intelligence read (power dynamic, tone signal)
 *   - tryFirst     — soft opening counter-ask
 *   - ifPushback   — firmer fallback if they refuse
 *   - leverage     — who has more leverage on this specific clause
 *   - walkAway     — whether this clause alone is a dealbreaker
 *   - matchCount   — how many times the pattern appears in the document
 *   - excerpt      — exact sentence/phrase from the document that triggered the flag
 */

const RISKY_CLAUSES = [

  // ─────────────────────────────────────────────────────────────────────────────
  // HIGH RISK
  // ─────────────────────────────────────────────────────────────────────────────

  {
    term: 'unlimited liability',
    // Narrow: require explicit "no cap" or "without limit" language.
    // "without limit" alone is broad but nearly always appears in a liability context.
    patterns: ['unlimited liability', 'no cap on liability', 'without limitation of liability', 'liable without limit'],
    level: 'High',
    note: 'There is no ceiling on what you could owe — one bad outcome could cost far more than the entire contract is worth.',
    eq: 'This signals the other party is anxious about catastrophic loss and wants a safety net at your expense. They may be hiding risk they already know about.',
    tryFirst: 'Liability for both parties shall be capped at the total fees paid under this agreement.',
    ifPushback: 'If a cap isn\'t on the table, I need to understand what specific catastrophic scenario you\'re trying to protect against — let\'s solve that directly instead.',
    leverage: 'A mutual cap is so standard that refusing it is a red flag. You have more room to push than you think.',
    walkAway: 'If they flatly refuse any liability cap, reconsider the deal entirely.',
  },

  {
    term: 'indemnification',
    // "indemnif" is a reliable stem — catches indemnify / indemnification / indemnified.
    // "hold harmless" and "defend and indemnify" are the other canonical forms.
    patterns: ['indemnif', 'hold harmless', 'defend and indemnify'],
    level: 'High',
    note: 'You may have to pay the other party\'s legal costs and damages for third-party claims — even claims that aren\'t your fault.',
    eq: 'Broad indemnification is often boilerplate power-shifting. It feels scary but is frequently negotiable once you name it.',
    tryFirst: 'Each party indemnifies the other only for its own negligence or willful misconduct.',
    ifPushback: 'Let\'s cap mutual indemnification at fees paid under the contract and change "arising out of or related to" to "directly caused by."',
    leverage: 'The drafting party has more leverage here, but narrowing the scope is a very standard ask.',
    walkAway: 'One-sided, uncapped indemnification with no causation limit is a dealbreaker. A mutual, scoped version is fine.',
  },

  {
    term: 'non-compete',
    // Specific legal phrases only. "restrictive covenant" is broad but in a contracts
    // context it almost always means non-compete. Avoids false positives.
    patterns: ['non-compete', 'non compete', 'noncompete', 'covenant not to compete', 'restrictive covenant'],
    level: 'High',
    note: 'After this contract ends you may be legally barred from working with competitors or in your own industry.',
    eq: 'The other party fears you\'ll take knowledge or relationships elsewhere. This is often about control more than genuine business protection.',
    tryFirst: 'Non-compete shall apply for 6 months and only to direct competitors in the same product category.',
    ifPushback: 'If you need a non-compete, I can accept one scoped to named direct competitors, for no more than 6 months, in my operating city only.',
    leverage: 'Broad non-competes are increasingly unenforceable. You have more leverage than you think.',
    walkAway: 'A broad, multi-year, industry-wide non-compete is a dealbreaker. A narrow, time-limited one is a negotiation point.',
  },

  {
    term: 'IP ownership — all rights to other party',
    // Tightened from the old "intellectual property assignment" entry.
    // Targets the specific language that assigns ownership (not just a licence).
    // "solely owned by" catches the supplier agreement's exact phrasing.
    // "all intellectual property" + "owned by" is the dangerous combination.
    patterns: [
      'all intellectual property',
      'all trademarks',
      'all designs',
      'owned exclusively by',
      'solely owned by',
      'ip shall vest',
      'intellectual property shall vest',
      'assigns all right, title',
      'work made for hire',
      'work-for-hire',
    ],
    level: 'High',
    note: 'Everything you create under this contract — and potentially work you brought in — becomes the other party\'s property. You walk away owning nothing.',
    eq: 'IP grabs are often inserted as boilerplate without the other party thinking through the implications. Pushing back is usually welcomed once they understand what they\'re asking for.',
    tryFirst: 'IP assignment applies only to work specifically created and delivered under this contract — pre-existing tools and background IP stay mine.',
    ifPushback: 'I can grant a perpetual licence on my background IP for use in the deliverables, but ownership does not transfer.',
    leverage: 'IP overreach is common boilerplate and most counterparties will narrow it once asked directly.',
    walkAway: 'A full, unlimited IP grab including pre-existing work is a dealbreaker for most service providers.',
  },

  {
    term: 'liquidated damages / early termination penalty',
    // Specific legal terms only — low false-positive risk.
    patterns: ['liquidated damages', 'early termination penalty', 'termination fee', 'penalty clause', 'stipulated damages', 'remaining rent'],
    level: 'High',
    note: 'A pre-set penalty applies if you exit early or breach — sometimes far exceeding the actual loss suffered by the other side.',
    eq: 'The party inserting this is often risk-averse or has been burned before. Acknowledging their concern directly can defuse the negotiation.',
    tryFirst: 'Can we replace the fixed penalty with actual damages capped at fees paid — so it reflects real harm, not a windfall?',
    ifPushback: 'If a fixed figure stays, let\'s negotiate the number down to something proportionate and add a mutual damages cap.',
    leverage: 'Punitive penalty clauses are often unenforceable. You have more leverage than the dollar figure suggests.',
    walkAway: 'A disproportionate penalty clause is worth a hard push, but it\'s not automatically a dealbreaker if you can get the number to a reasonable level.',
  },

  {
    term: 'unilateral price / contract modification',
    // FIXED: Was "unilateral" alone — too broad, caused false positives.
    // Now requires a change/modify/price action alongside the discretion language.
    patterns: [
      'modify at any time',
      'change at any time',
      'amend at any time',
      'change pricing',
      'modify pricing',
      'adjust pricing',
      'change the price',
      'reserves the right to change',
      'reserves the right to modify',
      'may change the terms',
      'may amend these terms',
    ],
    level: 'High',
    note: 'The other party can change the price or contract terms without your agreement — the deal you signed may not be the deal you end up with.',
    eq: 'This clause tells you the other party doesn\'t view this as a mutual agreement — they view it as a policy they\'re issuing to you.',
    tryFirst: 'Any modification requires written agreement from both parties.',
    ifPushback: 'I can accept notice-only changes for minor operational items, but pricing and scope require mutual written consent.',
    leverage: 'You have full leverage to walk — this clause fundamentally undermines the contract as a binding agreement.',
    walkAway: 'If they won\'t agree to any consent requirement for material changes, reconsider the deal entirely.',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // MEDIUM RISK
  // ─────────────────────────────────────────────────────────────────────────────

  {
    term: 'auto-renewal',
    patterns: ['auto-renew', 'auto renew', 'automatically renew', 'automatic renewal', 'evergreen clause', 'shall renew unless', 'renews automatically'],
    level: 'Medium',
    note: 'The contract extends silently unless you cancel within a specific window — easy to miss and expensive to undo.',
    eq: 'This is a passive revenue-retention tactic. The other party is banking on you forgetting, not on you genuinely wanting to continue.',
    tryFirst: 'This agreement renews only with written consent from both parties, or a 60-day cancellation window.',
    ifPushback: 'If auto-renewal stays, extend the cancellation window to 90 days and require them to send written notice when the window opens.',
    leverage: 'Auto-renewal is a convenience clause for them, not a business necessity. They can almost always live without it.',
    walkAway: 'This alone shouldn\'t kill the deal, but a very short cancellation window is worth a firm ask.',
  },

  {
    term: 'exclusive supply obligation',
    // Targets distributor/supply agreements specifically.
    // "100% of its requirements" and "all of its requirements" are the high-risk phrases.
    // "shall purchase exclusively" and "sole supplier" also catch it without being overly broad.
    patterns: [
      '100% of its requirements',
      'all of its requirements',
      'shall purchase exclusively',
      'sole supplier',
      'exclusive supplier',
      'exclusively from supplier',
      'purchase all products from',
    ],
    level: 'Medium',
    note: 'You are locked into buying everything from one supplier — if they can\'t deliver, your business stops but the contract keeps running.',
    eq: 'Exclusivity benefits the supplier far more than you. They want guaranteed revenue; you want a reliable supply chain. Those aren\'t the same thing.',
    tryFirst: 'I\'m open to exclusivity with a minimum service level guarantee — if you can\'t fulfil an order, I need the right to source elsewhere without penalty.',
    ifPushback: 'If 100% requirements exclusivity stays, I need a force majeure carve-out and a step-down to 80% if you miss two consecutive delivery windows.',
    leverage: 'You have real leverage — exclusivity is a significant concession. Don\'t give it without something concrete in return.',
    walkAway: 'Exclusivity without a supply guarantee or exit ramp is close to a dealbreaker.',
  },

  {
    term: 'liability cap (suspiciously low)',
    // Catches the specific pattern of capping liability to a very short payment period.
    // "30 days" is the red-flag number from Contract 2. Also catches "one month's fees",
    // "amounts paid in the preceding 30" etc.
    patterns: [
      'liability is limited to',
      'liability shall be limited to',
      'liability shall not exceed',
      'liability is capped at',
      'shall not exceed the amounts paid',
      'shall not exceed fees paid',
      'shall not exceed one month',
      'shall not exceed 30 days',
      'maximum liability',
    ],
    level: 'Medium',
    note: 'The other party\'s liability is capped so low that even a serious breach leaves you unable to recover meaningful compensation.',
    eq: 'A 30-day payment cap signals the other party has thought carefully about their downside exposure and has no intention of being accountable for real losses.',
    tryFirst: 'Liability cap should reflect 12 months of fees paid — that\'s a standard market position for a meaningful commercial relationship.',
    ifPushback: 'If a lower cap stays, I need a carve-out so the cap doesn\'t apply to breaches caused by gross negligence, fraud, or wilful misconduct.',
    leverage: 'They inserted this deliberately. The 30-day number is almost never the real market rate — push for 6–12 months.',
    walkAway: 'A cap at 30 days of payment for a long-term supply relationship is a serious flag. Don\'t sign without improving this number.',
  },

  {
    term: 'minimum purchase commitment / shortfall penalty',
    // Specific phrases from distribution and supply agreements.
    // "purchase commitment" alone could be neutral — require "minimum" or "penalty" nearby.
    patterns: [
      'minimum purchase',
      'minimum order',
      'purchase commitment',
      'shortfall penalty',
      'failure to meet',
      'penalty for shortfall',
      'purchase obligation',
    ],
    level: 'Medium',
    note: 'You must buy a minimum quantity every period or pay a penalty — even if demand drops, your supplier changes prices, or the market shifts.',
    eq: 'Minimum purchase commitments are the supplier\'s way of guaranteeing revenue at your risk. The penalty is what tells you how seriously to take it.',
    tryFirst: 'Can we tie the minimum to a rolling 12-month average based on actual order history, not a fixed number set today?',
    ifPushback: 'If a fixed minimum stays, I need a force majeure carve-out and a step-down provision so the commitment reduces if you miss delivery windows.',
    leverage: 'You have leverage here if you have alternative suppliers. The penalty percentage (20% is steep) is always negotiable.',
    walkAway: 'A high penalty (above 15%) with no carve-outs for supplier failure is worth a very hard push.',
  },

  {
    term: 'termination for convenience (one-sided)',
    // More specific than before — targeting "may terminate" + "without cause" type language.
    // Avoids hitting mutual termination clauses.
    patterns: [
      'terminate for convenience',
      'termination for convenience',
      'terminate without cause',
      'terminate at will',
      'terminate at any time without',
      'terminate this agreement at any time',
      'without reason',
    ],
    level: 'Medium',
    note: 'The other party can end the contract whenever they choose — you carry all the preparation and investment risk with no guaranteed runway.',
    eq: 'One-sided termination rights signal low commitment. They want flexibility while expecting you to commit fully.',
    tryFirst: 'Can we make termination for convenience mutual, with a 60-day notice period for both sides?',
    ifPushback: 'If they keep the right to terminate at will, I need a kill fee equal to work-in-progress costs plus 30 days of fees.',
    leverage: 'You have leverage on the notice period and kill fee — push there.',
    walkAway: 'One-sided termination with no kill fee or notice period is worth a hard push.',
  },

  {
    term: 'arbitration',
    patterns: ['arbitration', 'binding arbitration', 'mandatory arbitration', 'waiver of jury trial', 'waives the right to jury', 'waive any right to a jury'],
    level: 'Medium',
    note: 'Disputes go to private arbitration, not a court — you waive your right to a jury trial and the process favours the party that uses it most often.',
    eq: 'Arbitration clauses are almost always inserted by the larger party who expects to win more in private proceedings than in public court.',
    tryFirst: 'Can we make arbitration optional rather than mandatory, and split the filing costs equally?',
    ifPushback: 'If mandatory arbitration stays, I need the seat in my jurisdiction and a neutral arbitrator selection process.',
    leverage: 'They likely have more leverage here, but venue and cost-sharing are genuinely negotiable.',
    walkAway: 'Mandatory arbitration alone shouldn\'t kill the deal. Combined with a foreign jurisdiction and no cost-sharing, it gets much more concerning.',
  },

  {
    term: 'rent escalation / compounding increases',
    // Real estate specific. "per annum" + "increase" is the pattern.
    // "compounding" catches the dangerous 8% compound case.
    patterns: [
      'rent escalation',
      'annual increase',
      'rent increase',
      'compounding increase',
      'percent per annum',
      '% per annum',
      'annual escalation',
      'escalation clause',
    ],
    level: 'Medium',
    note: 'Rent increases every year — compounding increases can push your cost dramatically higher by year 3 or 4 even if the base rent looked affordable.',
    eq: 'Landlords build in escalation to protect against inflation, but compounding rates well above CPI are a revenue grab, not an inflation hedge.',
    tryFirst: 'Can we cap annual increases at the lower of [X]% or the actual CPI rate for the preceding year?',
    ifPushback: 'If compounding stays, I need a total rent cap — no more than [X]% above the initial rent over the full term.',
    leverage: 'CPI-linked caps are market standard. A fixed compound rate above 3% is unusual and pushable.',
    walkAway: 'An 8% compounding increase over a 5-year lease represents a 47% rent increase by year 5. Model this out before signing.',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // LOW RISK (Watch)
  // ─────────────────────────────────────────────────────────────────────────────

  {
    term: 'force majeure',
    // Standard clause — but flag it because asymmetric drafting (only one party excused)
    // is the real risk. Patterns are specific to the clause type.
    patterns: ['force majeure', 'act of god', 'acts of god', 'circumstances beyond', 'unforeseeable circumstances', 'beyond the reasonable control'],
    level: 'Low',
    note: 'Either party may be excused from performing in extraordinary events — watch for asymmetric drafting where only one party benefits and the other\'s payment obligations continue.',
    eq: 'Force majeure is standard, but asymmetric drafting where only the supplier is excused while your payments continue is a significant imbalance worth naming.',
    tryFirst: 'Can we confirm force majeure applies equally to both parties and gives either side the right to terminate after 30 days of non-performance?',
    ifPushback: 'At minimum, if force majeure excuses their performance, it must also suspend my payment obligations for the same period.',
    leverage: 'Symmetry is the ask — that\'s hard to argue against in good faith.',
    walkAway: 'If force majeure only excuses one party while the other\'s obligations continue unchanged, that\'s a material risk worth fixing.',
  },

  {
    term: 'governing law / foreign jurisdiction',
    patterns: ['governing law', 'choice of law', 'venue shall be', 'courts of', 'jurisdiction of'],
    level: 'Low',
    note: 'Disputes will be resolved under the laws of a state or country that may be unfamiliar and more expensive to litigate in.',
    eq: 'The other party chose their home turf. It\'s a subtle power signal — and an inconvenience that becomes very real if there\'s ever a dispute.',
    tryFirst: 'Can we use the jurisdiction where the work is primarily performed — that\'s most neutral for both of us.',
    ifPushback: 'If your jurisdiction stays, I\'d like to confirm that choice of law doesn\'t waive mandatory protections in my local jurisdiction.',
    leverage: 'It\'s their template. But it\'s an easy give because it rarely matters unless there\'s a real dispute.',
    walkAway: 'This alone shouldn\'t kill the deal — it\'s a watch item, not a dealbreaker.',
  },

  {
    term: 'sole discretion / consent withheld',
    // NARROWED: was too broad. Now requires "discretion" near assignment/consent/approval context.
    // Removed "in its sole discretion" as a standalone — too many false positives.
    patterns: [
      'sole and absolute discretion',
      'may withhold consent',
      'withhold its consent',
      'consent may be withheld',
      'absolute discretion to',
      'sole discretion to approve',
      'sole discretion to deny',
    ],
    level: 'Low',
    note: 'The other party can block your request — to assign the lease, sublet, or make a change — for any reason, with no accountability.',
    eq: 'This is a control clause dressed as a consent process. If they can say no for any reason, the right you think you\'re getting is not really a right.',
    tryFirst: 'Can we add that consent can\'t be unreasonably withheld, conditioned, or delayed — and that silence for 15 business days counts as approval?',
    ifPushback: 'If absolute discretion stays, I need a defined list of the specific reasons they\'re allowed to deny.',
    leverage: '"Not unreasonably withheld" is completely standard. It\'s hard for them to justify refusing it.',
    walkAway: 'Absolute consent rights on key operational matters are worth a firm push.',
  },

  {
    term: 'security deposit (discretionary return)',
    patterns: ['security deposit', 'months\' rent', 'months rent', 'deductions landlord', 'deems appropriate', 'less deductions', 'landlord deems', 'refundable deposit'],
    level: 'Low',
    note: 'A multi-month deposit held with vague return conditions — the landlord can make discretionary deductions with no objective criteria to challenge.',
    eq: 'Vague return language on a large deposit is almost never an oversight. If they can\'t define the deduction criteria now, they\'ll define them at their convenience later.',
    tryFirst: 'Can we agree the deposit is returned within 30 days of lease end, less only itemised, documented deductions for physical damage beyond normal wear and tear?',
    ifPushback: 'If discretionary language stays, I need the deposit held in a separate escrow account and disputed deductions to go to a neutral arbitrator within 10 days.',
    leverage: 'The deposit amount is usually fixed, but the return conditions are very negotiable.',
    walkAway: 'A large deposit with fully discretionary return conditions is a real risk.',
  },

  {
    term: 'unrestricted right of entry',
    // FIXED false positive: patterns now require premises-specific language.
    // Removed "at any time" as a standalone — far too broad and caused bleeding
    // across categories (e.g. "terminate at any time" was hitting this clause).
    patterns: [
      'right of entry',
      'right to enter the premises',
      'enter the premises at any time',
      'access the premises without notice',
      'enter with or without notice',
      'landlord may enter',
      'landlord shall have the right to enter',
      'without prior notice to tenant',
    ],
    level: 'Low',
    note: 'The landlord can enter your space at any time with no notice — creating unpredictability and a real privacy risk for your operations.',
    eq: 'Unrestricted access rights are often inserted out of habit. Most landlords don\'t want to exercise them — they just don\'t want to be constrained.',
    tryFirst: 'Can we require at least 24 hours written notice for non-emergency entry, restricted to business hours?',
    ifPushback: 'Emergency access without notice is fine — I\'ll agree to that specifically. But inspections and showings need 24 hours minimum.',
    leverage: '24-hour notice is a standard tenant right in most jurisdictions. It\'s a very easy give.',
    walkAway: 'This alone shouldn\'t kill the deal, but "at any time without notice" is worth fixing.',
  },

  {
    term: 'tenant solely responsible for all repairs',
    // Real estate specific. "all repairs" + "including structural" is the red flag combination.
    patterns: [
      'all repairs',
      'solely responsible for repairs',
      'including structural',
      'tenant shall maintain',
      'tenant shall repair',
      'at tenant\'s sole expense',
      'tenant\'s sole cost',
    ],
    level: 'Low',
    note: 'You are responsible for every repair — including structural work — which is normally the landlord\'s obligation and can mean six-figure surprise costs.',
    eq: 'This clause is often inserted to eliminate the landlord\'s most expensive obligations. It\'s not standard in most commercial leases.',
    tryFirst: 'Can we limit tenant responsibility to interior, non-structural repairs? Structural, roof, HVAC, and systems should stay with the landlord.',
    ifPushback: 'If you need me to cover structural repairs, I need a cap on my annual repair obligation and the right to demand repairs be done by licensed contractors with a warranty.',
    leverage: 'Splitting structural from non-structural is the market standard. The ask is entirely reasonable.',
    walkAway: 'Sole responsibility for structural repairs without any cap is worth a hard push.',
  },

  {
    term: 'confidentiality / NDA',
    patterns: ['non-disclosure', 'confidential information', 'shall not disclose', 'must keep confidential', 'strict confidence'],
    level: 'Low',
    note: 'Broad confidentiality language — especially with no carve-outs for advisors or legal counsel — can put you in technical breach from routine business conversations.',
    eq: 'Overly broad NDAs are sometimes used to chill legitimate communication, not just protect genuine trade secrets.',
    tryFirst: 'Can we narrow "confidential information" to specific defined categories, and carve out disclosure to legal counsel and accountants under their own professional obligations?',
    ifPushback: 'If broad scope stays, I need a cure period of at least 10 days before a breach is actionable and a cap on breach penalties.',
    leverage: 'NDA scope is a genuine negotiation. Carve-outs and cure periods are the most achievable wins.',
    walkAway: 'This alone shouldn\'t kill the deal, but unlimited penalties for an overly broad NDA are worth a firm push.',
  },

  {
    term: 'one-sided attorney\'s fees',
    // Narrowed: "attorney" alone hit too many neutral contexts. Now requires fee-shifting language.
    patterns: [
      'attorneys\' fees',
      'attorney\'s fees',
      'costs of litigation',
      'legal costs',
      'prevailing party',
      'shall pay all legal',
      'shall bear all costs',
    ],
    level: 'Low',
    note: 'If one party bears all litigation costs, you carry all the financial risk of asserting your rights — even when you\'re in the right.',
    eq: 'One-sided fee clauses are designed to chill your ability to push back. The subtext is: "don\'t even think about suing us."',
    tryFirst: 'Can we make attorney\'s fees mutual — the prevailing party recovers from the losing party, equally for both sides?',
    ifPushback: 'If one-sided exposure stays, I need a litigation cap so my worst-case scenario is defined.',
    leverage: 'Mutual fee-shifting is standard and hard to argue against in good faith.',
    walkAway: 'A fully one-sided fee clause is worth a firm push — if they won\'t make it mutual, that tells you something about how they handle disputes.',
  },
]

/**
 * Extracts the best matching excerpt from the document text for a given clause.
 * Returns the exact sentence or phrase that triggered the flag.
 *
 * Rules:
 *  - Never truncates mid-word or mid-sentence.
 *  - Walks back to the nearest sentence-start boundary (., !, ?, ;, \n).
 *  - Walks forward until a sentence-end boundary is found (., !, ?, ;, \n).
 *  - Hard cap is 600 chars forward; if no boundary found within that, trims
 *    back to the last whitespace so we never cut a word.
 */
function extractExcerpt(text, patterns) {
  const lower = text.toLowerCase()
  let bestPat = null
  let bestPos = -1

  for (const pat of patterns) {
    const pos = lower.indexOf(pat)
    if (pos !== -1 && (bestPos === -1 || pos < bestPos)) {
      bestPos = pos
      bestPat = pat
    }
  }

  if (bestPos === -1) return null

  // ── Walk BACK to nearest sentence-start boundary ──────────────────────────
  // Sentence starters: char after ., !, ?, ;, or \n (skip trailing whitespace)
  const LOOK_BACK = 400  // max chars to scan backwards
  let start = Math.max(0, bestPos - LOOK_BACK)
  for (let i = bestPos - 1; i >= start; i--) {
    const ch = text[i]
    if (ch === '.' || ch === '!' || ch === '?' || ch === ';' || ch === '\n') {
      // start is the character after this boundary, skip any leading whitespace
      start = i + 1
      break
    }
  }
  // If we ran all the way back without finding a boundary, start is already set
  // to bestPos - LOOK_BACK. Trim forward to first non-space to avoid leading spaces.
  while (start < bestPos && (text[start] === ' ' || text[start] === '\t' || text[start] === '\n')) {
    start++
  }

  // ── Walk FORWARD to nearest sentence-end boundary ─────────────────────────
  const LOOK_FORWARD = 600  // generous limit — most contract sentences fit here
  const searchEnd = Math.min(text.length, bestPos + LOOK_FORWARD)
  let end = searchEnd
  let foundBoundary = false
  for (let i = bestPos + bestPat.length; i < searchEnd; i++) {
    const ch = text[i]
    if (ch === '.' || ch === '!' || ch === '?' || ch === ';' || ch === '\n') {
      end = i + 1  // include the punctuation
      foundBoundary = true
      break
    }
  }

  // If no sentence boundary found within limit, trim back to last whitespace
  // so we never cut a word in half.
  if (!foundBoundary && end < text.length) {
    let ws = end - 1
    while (ws > bestPos + bestPat.length && text[ws] !== ' ' && text[ws] !== '\t' && text[ws] !== '\n') {
      ws--
    }
    if (ws > bestPos + bestPat.length) end = ws
  }

  return text.slice(start, end).replace(/\s+/g, ' ').trim()
}

export function RiskAnalyzerAgent({ filename, text, pageCount, error }) {
  if (error) return { filename, pageCount: 0, findings: [], error }

  const lower = text.toLowerCase()

  const findings = RISKY_CLAUSES.reduce((acc, clause) => {
    const matchCount = clause.patterns.reduce((n, pat) => {
      let count = 0, pos = 0
      while ((pos = lower.indexOf(pat, pos)) !== -1) { count++; pos += pat.length }
      return n + count
    }, 0)

    if (matchCount > 0) {
      acc.push({
        term:        clause.term,
        level:       clause.level,
        note:        clause.note,
        eq:          clause.eq,
        tryFirst:    clause.tryFirst,
        ifPushback:  clause.ifPushback,
        leverage:    clause.leverage,
        walkAway:    clause.walkAway,
        // legacy field kept for backwards compat
        negotiate:   clause.tryFirst,
        matchCount,
        excerpt:     extractExcerpt(text, clause.patterns),
      })
    }
    return acc
  }, [])

  // Sort: High → Medium → Low
  const order = { High: 0, Medium: 1, Low: 2 }
  findings.sort((a, b) => (order[a.level] ?? 1) - (order[b.level] ?? 1) || b.matchCount - a.matchCount)

  return { filename, pageCount, findings }
}
