import lawyerImg from '../assets/lawyer-desk.jpg'
import PracticeCards from './PracticeCards'

export default function About({ onSelect }) {
  return (
    <>
      <section className="cg-about" id="about">
        <div className="cg-about-text">
          <p className="cg-eyebrow">What Is Contracty?</p>
          <p>
            Most contract tools assume you already speak legal. Contracty does not.
            We translate leases, vendor deals, and settlement papers into everyday
            words so a first-time owner can decide: sign, ask for a change, or pause.
          </p>
          <p>
            On a regular basis, contract lawyers for small businesses draft, review, and negotiate
            everyday commercial agreements to protect the company from legal and financial risks.
            With AI, that kind of support is now accessible to small firms at no cost.
          </p>
        </div>
        <img src={lawyerImg} alt="Lawyer's desk" className="cg-about-image" />
      </section>
      <PracticeCards onSelect={onSelect} />
    </>
  )
}
