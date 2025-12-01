import React, { useState } from 'react';

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const upload = async (e) => {
    e.preventDefault();
    if (!file) return alert('select file');
    const form = new FormData();
    form.append('file', file);

    setStatus('Uploading...');
    try {
      const resp = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/upload', {
        method: 'POST',
        body: form
      });
      const data = await resp.json();
      setStatus('Uploaded: ' + (data.id || JSON.stringify(data)));
    } catch (err) {
      console.error(err);
      setStatus('Upload failed');
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
