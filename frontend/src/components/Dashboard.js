import React, { useEffect, useState } from 'react';

export default function Dashboard() {
  const [calls, setCalls] = useState([]);
  const [detailsById, setDetailsById] = useState({});
  const [loadingIds, setLoadingIds] = useState({});
  const [errorById, setErrorById] = useState({});

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    fetch(apiUrl + '/api/calls')
      .then(r => r.json())
      .then(setCalls)
      .catch(console.error);
  }, []);

  const fetchDetails = async (id) => {
    if (detailsById[id] || loadingIds[id]) return;
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    setLoadingIds(prev => ({ ...prev, [id]: true }));
    setErrorById(prev => ({ ...prev, [id]: null }));
    try {
      const resp = await fetch(`${apiUrl}/api/calls/${id}`);
      if (!resp.ok) throw new Error(`Status ${resp.status}`);
      const data = await resp.json();
      setDetailsById(prev => ({ ...prev, [id]: data }));
    } catch (err) {
      console.error('Fetch call details failed', err);
      setErrorById(prev => ({ ...prev, [id]: err.message }));
    } finally {
      setLoadingIds(prev => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  };

  return (
    <div>
      <h4>Recent Calls</h4>
      {calls.length === 0 && <div>No calls yet.</div>}
      <div>
        {calls.map(c => {
          const details = detailsById[c._id];
          return (
            <div key={c._id} style={{ border: '1px solid #ddd', padding: 12, marginBottom: 8 }}>
              <div><strong>{c.filename}</strong> — {new Date(c.createdAt).toLocaleString()}</div>
              <div>Status: {c.status}</div>

              <div style={{ marginTop: 8 }}>
                <details onToggle={(e) => { if (e.target.open) fetchDetails(c._id); }}>
                  <summary>Transcript</summary>
                  <div style={{ padding: 8 }}>
                    {loadingIds[c._id] && <div>Loading...</div>}
                    {errorById[c._id] && <div style={{ color: 'red' }}>Error: {errorById[c._id]}</div>}
                    {details && <pre style={{ whiteSpace: 'pre-wrap' }}>{details.transcript}</pre>}
                    {!details && !loadingIds[c._id] && !errorById[c._id] && <div>Open to load transcript</div>}
                  </div>
                </details>

                <details onToggle={(e) => { if (e.target.open) fetchDetails(c._id); }}>
                  <summary>Scores</summary>
                  <div style={{ padding: 8 }}>
                    {loadingIds[c._id] && <div>Loading...</div>}
                    {details && <pre>{JSON.stringify(details.scores, null, 2)}</pre>}
                  </div>
                </details>

                <details onToggle={(e) => { if (e.target.open) fetchDetails(c._id); }}>
                  <summary>Coaching Plan</summary>
                  <div style={{ padding: 8 }}>
                    {loadingIds[c._id] && <div>Loading...</div>}
                    {details && <pre>{JSON.stringify(details.coachingPlan, null, 2)}</pre>}
                  </div>
                </details>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
