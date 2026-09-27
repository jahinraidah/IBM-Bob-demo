import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { useAuth } from '../AuthContext';

export default function HistorySidebar({ onSelect, refreshTrigger }) {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'analyses'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setHistory(docs);
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user, refreshTrigger]); // Re-fetch when a new analysis is saved

  if (loading) return <div className="cg-history-panel">Loading history...</div>;
  if (history.length === 0) return <div className="cg-history-panel">No past analyses yet.</div>;

  return (
    <div className="cg-history-panel">
      <h3 style={{ fontSize: '11px', color: '#00d9ff', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: '12px' }}>Previous Analyses</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.reportHTML, item.findingsCount, item.filename)}
            className="cg-history-item"
          >
            <span className="cg-history-filename">{item.filename}</span>
            <span className="cg-history-meta">{item.findingsCount} risks · {item.createdAt?.toDate().toLocaleDateString() || 'Just now'}</span>
          </button>
        ))}
      </div>
    </div>
  );
}