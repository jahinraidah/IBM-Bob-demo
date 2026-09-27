import './App.css'
import { useAuth } from './AuthContext'
import Login from './Login'
import { db } from './firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Routes, Route, Link, useSearchParams } from 'react-router-dom'

import { ExtractorAgent } from './agents/ExtractorAgent'
import { RiskAnalyzerAgent } from './agents/RiskAnalyzerAgent'
import { ReportGeneratorAgent } from './agents/ReportGeneratorAgent'
import Navbar from './components/Navbar'
import About from './components/About'
import HistorySidebar from './components/HistorySidebar'
import HistoryPage from './components/HistoryPage'
import Guide from './components/Guide'
import SectorPage from './components/SectorPage'
import scalesImg from './assets/scales.jpg'
import lawyerImg from './assets/lawyer-desk.jpg'
import { SECTORS } from './sectors'

// Inline about block used only on the welcome page — no PracticeCards inside
function WelcomeAbout() {
  return (
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
  )
}

function PageFooter() {
  return (
    <footer className="cg-footer">
      <p className="cg-footer-copy">© 2026 Contracty · All rights reserved.</p>
    </footer>
  )
}

// ── Welcome / Home page ───────────────────────────────────────────────────────
function WelcomePage() {
  const liveSectors = SECTORS.filter(s => !s.comingSoon)

  return (
    <>
      {/* ── Hero ── */}
      <section className="cg-welcome-hero">
        <div className="cg-welcome-hero-content">
          <p className="cg-eyebrow">Private. Local. Yours.</p>
          <h1 className="cg-welcome-h1">
            Understand Your Contract.<br />Keep It Private.
          </h1>
          <p className="cg-welcome-sub">
            Contracty reads and explains your contracts entirely in your browser —
            nothing you upload ever touches a server. Get clarity before you talk
            to a lawyer, not instead of one.
          </p>
          <div className="cg-welcome-actions">
            <Link to="/tool" className="cg-welcome-cta">
              Get Started →
            </Link>
            <Link to="/guide" className="cg-welcome-secondary">
              How it works
            </Link>
          </div>
        </div>
        <div className="cg-welcome-hero-image">
          <img src={scalesImg} alt="Scales of justice" className="cg-scales-img" />
        </div>
      </section>

      <hr className="cg-divider" />

      {/* ── What is Contracty (text + lawyer image only, no practice cards) ── */}
      <WelcomeAbout />

      <hr className="cg-divider" />

      {/* ── Feature strip ── */}
      <section className="cg-features">
        <div className="cg-features-grid">
          <div className="cg-feature-card">
            <span className="cg-feature-icon">🔒</span>
            <h3>100% Private</h3>
            <p>Your PDF never leaves your browser. Text is extracted locally — no server, no storage.</p>
          </div>
          <div className="cg-feature-card">
            <span className="cg-feature-icon">📋</span>
            <h3>Plain English</h3>
            <p>Every flagged clause is explained the way a trusted friend would — not a lawyer billing by the hour.</p>
          </div>
          <div className="cg-feature-card">
            <span className="cg-feature-icon">💬</span>
            <h3>Know What to Say</h3>
            <p>Each risky clause comes with a plain-English sentence you can send straight back to the other side.</p>
          </div>
        </div>
      </section>

      <hr className="cg-divider" />

      {/* ── Sector cards — one set only ── */}
      <section className="cg-practice">
        <p className="cg-eyebrow">What Contracty Handles</p>
        <h2 style={{ color: '#ffffff' }}>Areas of Expertise</h2>
        <div className="cg-card-grid">
          {liveSectors.map(s => (
            <Link
              to={`/sectors/${s.slug}`}
              className="cg-practice-card"
              key={s.slug}
            >
              {s.img && <img src={s.img} alt={s.menuLabel} className="cg-practice-card-img" />}
              <div className="cg-practice-card-body">
                <h3>{s.menuLabel}</h3>
                <p>{s.mobileCard}</p>
                <span className="cg-card-arrow">{s.buttonCta} →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <hr className="cg-divider" />

      {/* ── Final CTA ── */}
      <section className="cg-welcome-final-cta">
        <h2>Ready to read the fine print?</h2>
        <p>Drop in a PDF and get a plain-English breakdown in seconds.</p>
        <Link to="/tool" className="cg-welcome-cta">
          Analyze a Contract →
        </Link>
      </section>

      <PageFooter />
    </>
  )
}

// ── Tool page (upload + analysis) ────────────────────────────────────────────
function ToolPage({ user }) {
  const [searchParams] = useSearchParams()
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [activeSlug, setActiveSlug] = useState(() => {
    const param = searchParams.get('sector')
    const match = param && SECTORS.find(s => s.slug === param)
    return match ? match.slug : (SECTORS[1]?.slug ?? SECTORS[0].slug)
  })
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('idle')
  const [report, setReport] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const inputRef = useRef(null)

  const handleFile = useCallback((selected) => {
    if (!selected) return
    setFile(selected)
    setStatus('idle')
    setReport(null)
  }, [])

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault()
      setDragOver(false)
      const dropped = e.dataTransfer.files[0]
      if (dropped) handleFile(dropped)
    },
    [handleFile]
  )

  const handleAnalyze = useCallback(async () => {
    if (!file) return
    setStatus('loading')
    setReport(null)
    setErrorMsg('')
    try {
      const extracted = await ExtractorAgent(file)
      const analyzed = RiskAnalyzerAgent(extracted)
      const html = ReportGeneratorAgent(analyzed)

      setReport({ html, analyzed })
      setStatus('done')

      // Save to Firestore (unchanged)
      try {
        await addDoc(collection(db, 'analyses'), {
          userId: user.uid,
          userEmail: user.email,
          filename: extracted.filename,
          pageCount: extracted.pageCount,
          findingsCount: analyzed.findings.length,
          findings: analyzed.findings,
          reportHTML: html,
          createdAt: serverTimestamp()
        })
        console.log('✅ Report saved to Firestore!')
        setRefreshTrigger(prev => prev + 1)
      } catch (dbErr) {
        console.error('❌ Firestore save failed:', dbErr)
      }
    } catch (err) {
      setErrorMsg(err?.message ?? 'Unknown error')
      setStatus('error')
    }
  }, [file, user])

  const handleDownloadPDF = useCallback(() => {
    if (!report?.html) return
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Contracty Risk Report</title>
  <style>
    body { font-family: 'Segoe UI', system-ui, sans-serif; font-size: 13px; line-height: 1.6; color: #1a1a1a; padding: 32px; max-width: 820px; margin: 0 auto; }
    h1, h2, h3 { font-family: 'Times New Roman', serif; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <h1 style="font-size:22px;margin-bottom:4px">Contracty Risk Report</h1>
  <p style="font-size:11px;color:#666;margin-bottom:24px">Generated ${new Date().toLocaleDateString()} — not legal advice</p>
  ${report.html}
</body>
</html>`)
    win.document.close()
    win.focus()
    win.print()
  }, [report])

  const activeSector = SECTORS.find(s => s.slug === activeSlug) ?? SECTORS[0]
  const liveSectors = SECTORS.filter(s => !s.comingSoon)

  return (
    <>
      <main className="cg-main" id="tool">
        {/* LEFT COLUMN: Upload + History */}
        <section className="cg-upload-section">

          {/* Drop zone */}
          <div
            className={`cg-dropzone${dragOver ? ' cg-dropzone--over' : ''}${file ? ' cg-dropzone--has-file' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
            aria-label="Upload contract file"
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf"
              className="cg-file-input"
              onChange={(e) => handleFile(e.target.files[0])}
            />
            <div className="cg-dropzone-icon-wrap" aria-hidden="true">⬆</div>
            {file ? (
              <div className="cg-file-info">
                <span className="cg-filename">{file.name}</span>
                <span className="cg-filesize">{(file.size / 1024).toFixed(1)} KB</span>
              </div>
            ) : (
              <>
                <span className="cg-dropzone-primary">Drop your contract here</span>
                <span className="cg-dropzone-secondary">or click to browse — PDF only</span>
              </>
            )}
          </div>

          {/* Contract type selector */}
          <label className="cg-type-label">
            <span>What kind of paper is this?</span>
            <select
              className="cg-type-select"
              value={activeSlug}
              onChange={(e) => setActiveSlug(e.target.value)}
            >
              {SECTORS.map(s => (
                <option key={s.slug} value={s.slug} disabled={s.comingSoon}>
                  {s.menuLabel}
                </option>
              ))}
            </select>
          </label>

          {/* Analyze button */}
          <button
            className="cg-analyze-btn"
            onClick={handleAnalyze}
            disabled={!file || status === 'loading'}
          >
            {status === 'loading' ? (
              <><span className="cg-spinner" aria-hidden="true" /> Analyzing…</>
            ) : (
              activeSector.buttonCta ?? 'Analyze Contract'
            )}
          </button>

          {/* History */}
          <HistorySidebar
            refreshTrigger={refreshTrigger}
            onSelect={(html) => {
              setReport({ html })
              setStatus('done')
            }}
          />
        </section>

        {/* RIGHT COLUMN: Risk Report */}
        <section className="cg-report-section">
          <div className="cg-report-panel">
            <div className="cg-report-inner">

              {status === 'idle' && !report && (
                <div className="cg-report-empty">
                  <h1>Awaiting input</h1>
                  <p>
                    New to contracts? Pick a type, drop in the PDF, and we'll explain it in
                    everyday words. No legal background needed.
                  </p>
                  <div className="cg-empty-sectors">
                    {liveSectors.map(s => (
                      <a
                        key={s.slug}
                        href={`/sectors/${s.slug}`}
                        className="cg-empty-sector-card"
                        onClick={(e) => { e.preventDefault(); setActiveSlug(s.slug) }}
                      >
                        <p>{s.menuLabel}</p>
                        <p>{s.mobileCard}</p>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {status === 'loading' && (
                <div className="cg-report-empty">
                  <span className="cg-spinner cg-spinner--lg" aria-hidden="true" />
                  <h1>Running analysis…</h1>
                  <div className="cg-agent-pipeline" aria-live="polite">
                    <span className="cg-agent-step">ExtractorAgent initialised</span>
                    <span className="cg-agent-step">RiskAnalyzerAgent scanning clauses</span>
                    <span className="cg-agent-step">ReportGeneratorAgent building output</span>
                  </div>
                </div>
              )}

              {status === 'error' && (
                <div className="cg-report-empty cg-report-empty--error">
                  <h1>Pipeline error</h1>
                  <p>{errorMsg || 'Something went wrong — try again'}</p>
                </div>
              )}

              {status === 'done' && report && (
                <div className="cg-report-content">
                  <div className="cg-report-toolbar">
                    <p className="cg-section-title">Result · {activeSector.menuLabel}</p>
                    <button className="cg-download-btn" onClick={handleDownloadPDF}>
                      ↓ Download PDF
                    </button>
                  </div>
                  <div dangerouslySetInnerHTML={{ __html: report.html }} />
                </div>
              )}

            </div>
          </div>
        </section>
      </main>

      <PageFooter />
    </>
  )
}

// ── About page ────────────────────────────────────────────────────────────────
function AboutPage() {
  return (
    <>
      <main className="cg-about-page">
        <p className="cg-eyebrow">About</p>
        <h1 style={{ marginTop: 12, fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,2.4rem)', fontWeight: 600 }}>
          Built for people who just opened the doors.
        </h1>
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
        <p>
          We are not a law firm. We will not fill in for a lawyer when the money is
          large or the fight is serious. We will make sure you are not signing
          something you cannot explain out loud.
        </p>
      </main>
      <PageFooter />
    </>
  )
}

// ── Root App ──────────────────────────────────────────────────────────────────
export default function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--fg)' }}>
        Loading Contracty…
      </div>
    )
  }

  if (!user) {
    return <Login />
  }

  return (
    <div className="cg-layout">
      <Navbar user={user} />
      <Routes>
        <Route path="/"               element={<WelcomePage />} />
        <Route path="/tool"           element={<ToolPage user={user} />} />
        <Route path="/about"          element={<AboutPage />} />
        <Route path="/guide"          element={<><Guide /><PageFooter /></>} />
        <Route path="/history"        element={<><HistoryPage /><PageFooter /></>} />
        <Route path="/sectors/:slug"  element={<><SectorPage /><PageFooter /></>} />
      </Routes>
    </div>
  )
}
