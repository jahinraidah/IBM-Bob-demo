import { useState, useRef, useCallback } from 'react'
import './App.css'
import { ExtractorAgent } from './agents/ExtractorAgent'
import { RiskAnalyzerAgent } from './agents/RiskAnalyzerAgent'
import { ReportGeneratorAgent } from './agents/ReportGeneratorAgent'

// ─── Main App component ────────────────────────────────────────────────────────

export default function App() {
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('idle') // idle | loading | done | error
  const [report, setReport] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const inputRef = useRef(null)

  const handleFile = useCallback((selected) => {
    if (!selected) return
    setFile(selected)
    setStatus('idle')
    setReport('')
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
    setReport('')
    setErrorMsg('')
    try {
      const extracted = await ExtractorAgent(file)
      const analyzed = RiskAnalyzerAgent(extracted)
      const html = ReportGeneratorAgent(analyzed)
      setReport(html)
      setStatus('done')
    } catch (err) {
      setErrorMsg(err?.message ?? 'Unknown error')
      setStatus('error')
    }
  }, [file])

  return (
    <div className="cg-layout">
      <header className="cg-header">
        <div className="cg-header-inner">
          <div className="cg-logo">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <rect width="28" height="28" rx="7" fill="var(--accent)" />
              <path d="M8 8h8.5a3.5 3.5 0 0 1 0 7H8V8Z" fill="white" fillOpacity=".9" />
              <path d="M8 15h10a3.5 3.5 0 0 1 0 7H8v-7Z" fill="white" fillOpacity=".55" />
              <path d="M18 11.5h1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span></span>
          </div>
          <p></p>
        </div>
      </header>

      <main className="cg-main">
        <section className="cg-upload-section">
          <h2 className="cg-section-title">Upload Your Contract</h2>
          <p className="cg-section-sub">Upload a PDF contract. Text is extracted locally — nothing leaves your browser.</p>

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
            <div className="cg-dropzone-icon" aria-hidden="true">
              {file ? '📄' : '⬆️'}
            </div>
            {file ? (
              <div className="cg-file-info">
                <span className="cg-filename">{file.name}</span>
                <span className="cg-filesize">{(file.size / 1024).toFixed(1)} KB</span>
              </div>
            ) : (
              <div className="cg-dropzone-prompt">
                <span className="cg-dropzone-primary">Drop your contract here</span>
                <span className="cg-dropzone-secondary">or click to browse — PDF only</span>
              </div>
            )}
          </div>

          <button
            className="cg-analyze-btn"
            onClick={handleAnalyze}
            disabled={!file || status === 'loading'}
          >
            {status === 'loading' ? (
              <><span className="cg-spinner" aria-hidden="true" /> Analyzing…</>
            ) : (
              'Analyze Contract'
            )}
          </button>
        </section>

        <section className="cg-report-section">
          <h2 className="cg-section-title">Risk Report</h2>

          <div className="cg-report-panel">
            {/* Terminal chrome bar */}
            <div className="cg-terminal-bar" aria-hidden="true">
              <div className="cg-terminal-dots">
                <span /><span /><span />
              </div>
              <span className="cg-terminal-title">contractguard — risk-analyzer</span>
            </div>

            <div className="cg-report-inner">
              {status === 'idle' && !report && (
                <div className="cg-report-empty">
                  <div className="cg-report-empty-icon" aria-hidden="true">🛡️</div>
                  <p className="cg-report-empty-title">
                    Awaiting input<span className="cg-cursor" aria-hidden="true" />
                  </p>
                  <p className="cg-report-empty-sub">Upload a contract and click Analyze Contract</p>
                </div>
              )}
              {status === 'loading' && (
                <div className="cg-report-empty">
                  <span className="cg-spinner cg-spinner--lg" aria-hidden="true" />
                  <p className="cg-report-empty-title">Running pipeline…</p>
                  <div className="cg-agent-pipeline" aria-live="polite">
                    <span className="cg-agent-step">ExtractorAgent initialised</span>
                    <span className="cg-agent-step">RiskAnalyzerAgent scanning clauses</span>
                    <span className="cg-agent-step">ReportGeneratorAgent building output</span>
                  </div>
                </div>
              )}
              {status === 'error' && (
                <div className="cg-report-empty cg-report-empty--error">
                  <div className="cg-report-empty-icon" aria-hidden="true">⚠️</div>
                  <p className="cg-report-empty-title">Pipeline error</p>
                  <p className="cg-report-empty-sub">// {errorMsg || 'something went wrong — try again'}</p>
                </div>
              )}
              {status === 'done' && report && (
                <div
                  className="cg-report-content"
                  dangerouslySetInnerHTML={{ __html: report }}
                />
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="cg-footer">
        ContractGuard · Built with React
      </footer>
    </div>
  )
}
