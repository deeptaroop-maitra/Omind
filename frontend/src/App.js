import React, { useState } from 'react';
import Login from './components/Login';
import UploadForm from './components/UploadForm';
import Dashboard from './components/Dashboard';

export default function App() {
  const [user, setUser] = useState(null);

  if (!user) return <Login onLogin={setUser} />;

  return (
    <div style={{ padding: 20 }}>
      <h2>OMIND Prototype Dashboard</h2>
      <UploadForm />
      <hr />
      <Dashboard />
    </div>
  );
}
