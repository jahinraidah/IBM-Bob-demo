import { Link } from 'react-router-dom'
import { SECTORS } from '../sectors'

const HOW_TO_USE = [
  {
    step: '1',
    title: 'Pick the type of paper',
    body: 'Use the Contract menu. Choose the closest match. If you are renting a shop, that is Real Estate. If a supplier sent a deal, that is Business. If someone wants you to "settle," that is Civil Litigation.',
  },
  {
    step: '2',
    title: 'Drop in the PDF',
    body: 'Only PDF files. If someone sent you a Word file, export it as PDF first. One contract at a time is best.',
  },
  {
    step: '3',
    title: 'Read the plain-English report',
    body: "We highlight the parts that can cost you money or trap you. Each finding says what it means and a simple sentence you can send back.",
  },
  {
    step: '4',
    title: 'Download your report',
    body: 'Hit "Download PDF" on the report panel to save and print a copy. Take it to your next conversation or meeting.',
  },
  {
    step: '5',
    title: 'Take it to the table',
    body: "Contracty isn't a replacement for a lawyer — it's meant to get you into that conversation already understanding what you're signing. Use the report as your starting point.",
  },
]

const LEVEL_COPY = {
  watch: { label: 'Watch',               title: 'Noted. Not urgent.',      meaning: 'Keep an eye on it — nothing needs to change right now.' },
  ask:   { label: 'Ask to change',        title: 'Negotiate this one.',     meaning: 'As written, it favors the other side. Ask for a fairer version.' },
  stop:  { label: 'Pause before signing', title: 'Stop here.',              meaning: "This clause carries real risk. Don't sign until it's addressed." },
}

const liveSectors = SECTORS.filter(s => !s.comingSoon)

export default function Guide() {
  return (
    <section className="cg-guide" id="guide">
      <p className="cg-eyebrow">Guide</p>
      <h1 style={{ marginTop: 12, fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem,3.8vw,2.5rem)', fontWeight: 600, lineHeight: 1.22 }}>
        You started a business to build something — not to become a contract expert, and you shouldn't have to.
      </h1>
      <h1 style={{ marginTop: 16, fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem,3.8vw,2.5rem)', fontWeight: 600, lineHeight: 1.22, color: '#ffffff' }}>
        Contracty reads the fine print so you walk into every signing knowing exactly what you're agreeing to.
      </h1>

      <ol className="cg-guide-steps" style={{ listStyle: 'none', padding: 0 }}>
        {HOW_TO_USE.map(s => (
          <li key={s.step} className="cg-guide-step">
            <p className="cg-guide-step-num">Step {s.step}</p>
            <h2>{s.title}</h2>
            <p>{s.body}</p>
          </li>
        ))}
      </ol>

      <div style={{ marginTop: 48 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 600 }}>
          What the colors mean
        </h2>
        <div className="cg-guide-levels" style={{ marginTop: 16 }}>
          {Object.entries(LEVEL_COPY).map(([k, v]) => (
            <div key={k} className="cg-guide-level">
              <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{v.label}</p>
              <p style={{ fontWeight: 700, fontSize: '1rem' }}>{v.title}</p>
              <p style={{ marginTop: 2 }}>{v.meaning}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 48 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 600 }}>
          Which page should I open?
        </h2>
        <div className="cg-guide-sector-links" style={{ marginTop: 16 }}>
          {liveSectors.map(s => (
            <Link key={s.slug} to={`/sectors/${s.slug}`} className="cg-guide-sector-link">
              <p>{s.menuLabel}</p>
              <p>{s.dropdownBlurb}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
