import { useNavigate } from 'react-router-dom'
import { SECTORS } from '../sectors'

export default function PracticeCards({ onSelect }) {
  const navigate = useNavigate()
  const liveSectors = SECTORS.filter(s => !s.comingSoon)

  return (
    <section className="cg-practice">
      <p className="cg-eyebrow">What Contracty Handles</p>
      <h2>Areas of Practice</h2>
      <div className="cg-card-grid">
        {liveSectors.map((s) => (
          <a
            href={`/sectors/${s.slug}`}
            className="cg-practice-card"
            key={s.slug}
            onClick={(e) => {
              e.preventDefault()
              // If onSelect provided (home page context), use it; otherwise navigate
              if (onSelect) {
                onSelect(s.slug)
                document.getElementById('tool')?.scrollIntoView({ behavior: 'smooth' })
              } else {
                navigate(`/sectors/${s.slug}`)
              }
            }}
          >
            {s.img && <img src={s.img} alt={s.menuLabel} className="cg-practice-card-img" />}
            <div className="cg-practice-card-body">
              <p className="cg-eyebrow" style={{ marginBottom: 4 }}>{s.eyebrow}</p>
              <h3>{s.menuLabel}</h3>
              <p>{s.mobileCard}</p>
              <span className="cg-card-arrow">{s.buttonCta} →</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
