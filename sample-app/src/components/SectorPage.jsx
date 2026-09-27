import { useParams, Link } from 'react-router-dom'
import { SECTORS } from '../sectors'

const LEVEL_LABEL = { stop: 'Pause before signing', ask: 'Ask to change', watch: 'Watch' }
const LEVEL_MEANING = {
  stop:  'Do not sign yet. This can put your new business at real risk.',
  ask:   'This could hurt you. Ask them to fix the wording.',
  watch: 'Not a disaster. Just know it is there.',
}

export default function SectorPage() {
  const { slug } = useParams()
  const sector = SECTORS.find(s => s.slug === slug)

  if (!sector) {
    return (
      <main className="cg-sector-page">
        <p className="cg-eyebrow">Not found</p>
        <h1 style={{ marginTop: 12, fontFamily: 'var(--font-display)', fontSize: '2rem' }}>
          This page does not exist.
        </h1>
        <Link to="/" className="cg-btn-primary" style={{ marginTop: 24, display: 'inline-flex' }}>
          Go home
        </Link>
      </main>
    )
  }

  return (
    <main className="cg-sector-page">
      <p className="cg-eyebrow">{sector.comingSoon ? 'Coming soon' : sector.eyebrow}</p>
      <h1 style={{ marginTop: 12, fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,2.4rem)', fontWeight: 600 }}>
        {sector.headline}
      </h1>
      <p style={{ marginTop: 16, fontSize: '1.05rem', lineHeight: 1.75, color: 'var(--muted)' }}>
        {sector.subhead}
      </p>

      {!sector.comingSoon ? (
        <div className="cg-sector-actions">
          <Link to={`/tool?sector=${sector.slug}`} className="cg-btn-primary">{sector.buttonCta}</Link>
          <Link to="/" className="cg-btn-outline">← Back home</Link>
        </div>
      ) : (
        <p className="cg-coming-soon-note">
          Need a freelancer agreement today? Use{' '}
          <Link to="/sectors/business">Business &amp; Commercial Law</Link>.
          That is the right home until Employment opens.
        </p>
      )}

      {/* What this is */}
      {sector.whatThisIs && (
        <section>
          <h2>What this is (in one minute)</h2>
          <p style={{ marginTop: 12, fontSize: '0.97rem', lineHeight: 1.7, color: 'var(--muted)' }}>
            {sector.whatThisIs}
          </p>
        </section>
      )}

      {/* When you need this */}
      {sector.whenYouNeedThis?.length > 0 && (
        <section>
          <h2>When a new business needs this</h2>
          <ul className="cg-card-list" style={{ listStyle: 'none', padding: 0 }}>
            {sector.whenYouNeedThis.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {/* What to upload */}
      {sector.uploadThese?.length > 0 && (
        <section>
          <h2>What to upload</h2>
          <ul className="cg-card-grid-2" style={{ listStyle: 'none', padding: 0 }}>
            {sector.uploadThese.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {/* What we look for */}
      {sector.weLookFor?.length > 0 && (
        <section>
          <h2>What we look for</h2>
          <p style={{ marginTop: 8, fontSize: '0.87rem', color: 'var(--muted)' }}>
            We skip the scary words and ask the questions you actually care about.
          </p>
          <dl className="cg-lookfor-list">
            {sector.weLookFor.map(item => (
              <div key={item.title} className="cg-lookfor-item">
                <dt>{item.title}</dt>
                <dd>{item.plain}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* Glossary */}
      {sector.glossary?.length > 0 && (
        <section>
          <h2>Words you might see</h2>
          <p style={{ marginTop: 8, fontSize: '0.87rem', color: 'var(--muted)' }}>
            If the PDF uses a hard word, here is the translation.
          </p>
          <dl className="cg-glossary">
            {sector.glossary.map(g => (
              <div key={g.word} className="cg-glossary-row">
                <dt>{g.word}</dt>
                <dd>{g.means}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* Sample analysis */}
      {!sector.comingSoon && sector.sampleFindings?.length > 0 && (
        <section>
          <h2>Sample analysis</h2>
          <p style={{ marginTop: 8, marginBottom: 16, fontSize: '0.87rem', color: 'var(--muted)' }}>
            This is what a new owner should see after they upload and analyze.
          </p>
          <div className="cg-overall-box" style={{ marginBottom: 16 }}>
            {sector.sampleOverall}
          </div>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {sector.sampleFindings.map(f => (
              <li key={f.title} className="cg-finding">
                <div className="cg-finding-header">
                  <span className={`cg-badge cg-badge--${f.level}`}>{LEVEL_LABEL[f.level]}</span>
                  <span className="cg-badge-meaning">{LEVEL_MEANING[f.level]}</span>
                </div>
                <h3>{f.title}</h3>
                <p className="cg-finding-plain">{f.plain}</p>
                <div className="cg-finding-saythis">
                  <p className="cg-finding-saythis-label">What you can say</p>
                  <p>"{f.sayThis}"</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* FAQs */}
      {sector.faqs?.length > 0 && (
        <section>
          <h2>Common questions</h2>
          <div className="cg-faq-list">
            {sector.faqs.map(f => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
