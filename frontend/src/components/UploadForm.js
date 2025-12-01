import React, { useState } from 'react';

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const upload = async (e) => {
    e.preventDefault();
    if (!file) return alert('select file');
    const form = new FormData();
    form.append('file', file);

    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    setStatus(`Uploading to ${apiUrl}...`);
    try {
      const resp = await fetch(apiUrl + '/api/upload', {
        method: 'POST',
        body: form
      });
      const data = await resp.json();
      if (resp.ok) {
        setStatus('Uploaded: ' + (data.id || JSON.stringify(data)));
      } else {
        setStatus('Upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      setStatus('Upload failed: ' + err.message);
    }
  };

  return (
    <div>
      <h4>Upload Call Recording</h4>
      <form onSubmit={upload}>
        <input type="file" accept="audio/*" onChange={e => setFile(e.target.files[0])} />
        <button type="submit">Upload</button>
      </form>
      <div>{status}</div>
    </div>
  );
}
