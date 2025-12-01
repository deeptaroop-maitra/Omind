import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('demo');

  const submit = async (e) => {
    e.preventDefault();
    // mock login
    onLogin({ username });
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto' }}>
      <h3>Login (mock)</h3>
      <form onSubmit={submit}>
        <div>
          <label>Username</label>
          <input value={username} onChange={e => setUsername(e.target.value)} />
        </div>
        <div style={{ marginTop: 10 }}>
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
}
