import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { SECTORS } from '../sectors'

export default function Navbar({ user }) {
  const { logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const pathname = location.pathname

  const [dropOpen, setDropOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropAlign, setDropAlign] = useState('left')
  const dropRef = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    function onDoc(e) {
      if (!dropRef.current?.contains(e.target)) setDropOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  // Detect viewport edge when dropdown opens
  useEffect(() => {
    if (dropOpen && dropRef.current) {
      const rect = dropRef.current.getBoundingClientRect()
      const menuWidth = Math.min(320, window.innerWidth - 32)
      setDropAlign(rect.left + menuWidth > window.innerWidth - 16 ? 'right' : 'left')
    }
  }, [dropOpen])

  // Close both menus on route change
  useEffect(() => {
    setDropOpen(false)
    setMobileOpen(false)
  }, [pathname])

  const isActive = (path) => pathname === path
  const isSectorActive = pathname.startsWith('/sectors')

  return (
    <header className="cg-header">
      <div className="cg-header-inner" style={{ position: 'relative' }}>

        {/* Logo */}
        <Link to="/" className="cg-logo">
          <span className="cg-logo-icon">⚖</span>
          <span className="cg-wordmark">Contracty</span>
        </Link>

        {/* Desktop nav */}
        <nav className="cg-nav">
          <Link to="/" className={`cg-nav-link${isActive('/') ? ' cg-nav-link--active' : ''}`}>
            Home
          </Link>
          <Link to="/tool" className={`cg-nav-link${isActive('/tool') ? ' cg-nav-link--active' : ''}`}>
            Analyze
          </Link>
          <Link to="/about" className={`cg-nav-link${isActive('/about') ? ' cg-nav-link--active' : ''}`}>
            About
          </Link>

          {/* Contract dropdown */}
          <div className="cg-dropdown" ref={dropRef}>
            <button
              type="button"
              className={`cg-dropdown-trigger${isSectorActive || dropOpen ? ' cg-dropdown-trigger--active' : ''}${dropOpen ? ' cg-dropdown-trigger--open' : ''}`}
              onClick={() => setDropOpen(v => !v)}
              aria-expanded={dropOpen}
              aria-haspopup="menu"
            >
              Contract
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {dropOpen && (
              <div role="menu" className={`cg-dropdown-menu cg-dropdown-menu--${dropAlign}`}>
                {SECTORS.map(s => (
                  <Link
                    key={s.slug}
                    to={`/sectors/${s.slug}`}
                    role="menuitem"
                    className={`cg-dropdown-item${s.comingSoon ? ' cg-soon-item' : ''}`}
                    onClick={() => setDropOpen(false)}
                  >
                    <span className="cg-dropdown-item-label">{s.menuLabel}</span>
                    <span className="cg-dropdown-item-sub">{s.dropdownBlurb}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/guide" className={`cg-nav-link${isActive('/guide') ? ' cg-nav-link--active' : ''}`}>
            Guide
          </Link>
          <Link to="/history" className={`cg-nav-link${isActive('/history') ? ' cg-nav-link--active' : ''}`}>
            History
          </Link>
        </nav>

        {/* Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }} className="cg-nav">
          {user && (
            <div className="cg-user-icon-wrap" title={user.email}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
              <span className="cg-user-tooltip">{user.email}</span>
            </div>
          )}
          <button className="cg-signin-btn" onClick={user ? logout : () => navigate('/')}>
            {user ? 'Sign Out' : 'Sign In'}
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="cg-mobile-menu-btn"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMobileOpen(v => !v)}
        >
          <span /><span /><span />
        </button>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <nav className="cg-mobile-nav">
            <div className="cg-mobile-nav-inner">
              <Link to="/" className="cg-mobile-nav-link">Home</Link>
              <Link to="/tool" className="cg-mobile-nav-link">Analyze</Link>
              <Link to="/about" className="cg-mobile-nav-link">About</Link>
              <p className="cg-mobile-nav-section">Contract</p>
              {SECTORS.map(s => (
                <Link
                  key={s.slug}
                  to={`/sectors/${s.slug}`}
                  className="cg-mobile-nav-link"
                >
                  {s.menuLabel}
                </Link>
              ))}
              <Link to="/guide" className="cg-mobile-nav-link">Guide</Link>
              <Link to="/history" className="cg-mobile-nav-link">History</Link>
              {user && (
                <button
                  className="cg-mobile-nav-link"
                  style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit' }}
                  onClick={logout}
                >
                  Sign Out
                </button>
              )}
            </div>
          </nav>
        )}

      </div>
    </header>
  )
}
