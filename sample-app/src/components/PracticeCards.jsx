const FIELDS = [
  {
    title: "Real Estate Law",
    icon: "🏛",
    desc: "Tracks multi-contingency deadlines across closing documents and flags urgency in negotiations.",
    link: "#tool",
  },
  {
    title: "Business & Commercial Law",
    icon: "⚖",
    desc: "Balances power dynamics on IP ownership and liability caps between startups and large partners.",
    link: "#tool",
  },
  {
    title: "Civil Litigation",
    icon: "📄",
    desc: "Reads settlement risk tolerance and drafts binding settlement language in minutes.",
    link: "#tool",
  },
];

export default function PracticeCards() {
  return (
    <section className="cg-practice">
      <p className="cg-eyebrow">What Contracty Handles</p>
      <h2>Areas of Practice</h2>
      <div className="cg-card-grid">
        {FIELDS.map((f) => (
          <a href={f.link} className="cg-practice-card cg-glow-hover" key={f.title}>
            <span className="cg-practice-icon">{f.icon}</span>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
            <span className="cg-card-arrow">→</span>
          </a>
        ))}
      </div>
    </section>
  );
}