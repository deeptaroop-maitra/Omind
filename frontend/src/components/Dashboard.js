import React, { useEffect, useState } from 'react';

export default function Dashboard() {
  const [calls, setCalls] = useState([]);

  useEffect(() => {
    fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/calls')
      .then(r => r.json())
      .then(setCalls)
      .catch(console.error);
  }, []);

  return (
    <div>
      <h4>Recent Calls</h4>
      {calls.length === 0 && <div>No calls yet.</div>}
      <div>
        {calls.map(c => (
          <div key={c._id} style={{ border: '1px solid #ddd', padding: 12, marginBottom: 8 }}>
            <div><strong>{c.filename}</strong> — {new Date(c.createdAt).toLocaleString()}</div>
            <div>Status: {c.status}</div>
            {c.status === 'done' && (
              <div style={{ marginTop: 8 }}>
                <details>
                  <summary>Transcript</summary>
                  <pre style={{ whiteSpace: 'pre-wrap' }}>{c.transcript}</pre>
                </details>
                <details>
                  <summary>Scores</summary>
                  <pre>{JSON.stringify(c.scores, null, 2)}</pre>
                </details>
                <details>
                  <summary>Coaching Plan</summary>
                  <pre>{JSON.stringify(c.coachingPlan, null, 2)}</pre>
                </details>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
