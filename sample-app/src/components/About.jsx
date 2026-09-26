import lawyerImg from '../assets/lawyer-desk.jpg'

export default function About() {
  return (
    <>
      <hr className="cg-divider" />
      <section className="cg-about" id="about">
        <div className="cg-about-text">
          <p className="cg-eyebrow">What Is Contracty?</p>
          <p>
            On a regular basis, contract lawyers for small businesses draft, review, and negotiate
            everyday commercial agreements to protect the company from legal and financial risks.
            With the emergence of AI technologies, the need to make this kind of legal support
            accessible to small firms and businesses at no cost has become substantial. We, at
            Contracty, are aiming to solve this problem. While a paid platform like Spellbook
            already exists, we're building something completely free — for the maximum benefit
            of small entrepreneurs trying to figure everything out at once.
          </p>
        </div>
        <img src={lawyerImg} alt="Lawyer's desk" className="cg-about-image cg-glow-hover" />
      </section>
      <hr className="cg-divider" />
    </>
  )
}