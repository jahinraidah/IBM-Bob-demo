import { useState, useEffect } from 'react'
import { db } from '../firebase'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { useAuth } from '../AuthContext'

export default function HistoryPage() {
  const { user } = useAuth()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null) // { filename, reportHTML, findingsCount, pageCount, createdAt }

  useEffect(() => {
    if (!user) return
    const fetch = async () => {
      setLoading(true)
      try {
        const q = query(
          collection(db, 'analyses'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        )
        const snap = await getDocs(q)
        setHistory(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch (err) {
        console.error('History fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [user])

  const fmt = (ts) => ts?.toDate?.().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) ?? '—'

  return (
    <main className="cg-history-page">
      <p className="cg-eyebrow">Your Account</p>
      <h1 style={{ marginTop: 8, fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 600, color: '#ffffff' }}>
        Analysis History
      </h1>
      <p style={{ marginTop: 10, fontSize: '0.93rem', color: 'var(--muted)', marginBottom: 28 }}>
        Every contract you've run through Contracty, with the full report saved for you.
      </p>

      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--muted)', fontSize: '0.9rem' }}>
          <span className="cg-spinner" aria-hidden="true" /> Loading your analyses…
        </div>
      )}

      {!loading && history.length === 0 && (
        <div className="cg-history-empty">
          <p style={{ fontWeight: 600, color: 'var(--fg)', fontSize: '1rem' }}>No analyses yet.</p>
          <p style={{ marginTop: 4, color: 'var(--muted)', fontSize: '0.87rem' }}>
            Upload a contract on the <a href="/tool" style={{ color: 'var(--accent)' }}>Analyze page</a> and your reports will appear here.
          </p>
        </div>
      )}

      {!loading && history.length > 0 && !selected && (
        <div className="cg-history-list">
          {history.map(item => (
            <button
              key={item.id}
              className="cg-history-row"
              onClick={() => setSelected(item)}
            >
              <div className="cg-history-row-main">
                <span className="cg-history-row-filename">{item.filename}</span>
                <span className="cg-history-row-date">{fmt(item.createdAt)}</span>
              </div>
              <div className="cg-history-row-meta">
                <span>{item.pageCount} page{item.pageCount !== 1 ? 's' : ''}</span>
                <span className="cg-history-row-dot">·</span>
                <span>{item.findingsCount} clause{item.findingsCount !== 1 ? 's' : ''} flagged</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div className="cg-history-viewer">
          <div className="cg-history-viewer-toolbar">
            <button className="cg-history-back-btn" onClick={() => setSelected(null)}>
              ← Back to history
            </button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontWeight: 600, color: 'var(--fg)', fontSize: '0.97rem' }}>{selected.filename}</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
                {fmt(selected.createdAt)} · {selected.pageCount} page{selected.pageCount !== 1 ? 's' : ''} · {selected.findingsCount} finding{selected.findingsCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          <div className="cg-report-panel" style={{ marginTop: 16 }}>
            <div className="cg-report-inner">
              <div dangerouslySetInnerHTML={{ __html: selected.reportHTML }} />
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
