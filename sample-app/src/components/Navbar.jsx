export default function Navbar() {
  return (
    <header className="cg-header">
      <div className="cg-header-inner">
        <div className="cg-logo">
          <span className="cg-wordmark">Contracty</span>
        </div>
        <nav className="cg-nav">
          <a href="/">Home</a>
          <a href="#about">About</a>
          <div className="cg-dropdown">
            <span>Contract ▾</span>
            <div className="cg-dropdown-menu">
              <a href="#tool">Real Estate Law</a>
              <a href="#tool">Business & Commercial Law</a>
              <a href="#tool">Civil Litigation</a>
              <a href="#tool" className="cg-soon">Employment Law (Coming soon)</a>
            </div>
          </div>
          <a href="/resources">Resources</a>
          <a href="/guide">Guide</a>
        </nav>
        <button className="cg-signin-btn cg-glow-hover">Sign in</button>
      </div>
    </header>
  );
}