// src/components/FileUpload.tsx
'use client';

import React, { useState } from 'react';

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    try {
      const data = new FormData();
      data.set('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      if (!res.ok) throw new Error(await res.text());

      const result = await res.json();
      setFileUrl(result.file.filepath);
      setMessage('File uploaded successfully.');
    } catch (e) {
      console.error(e);
      setMessage('Error uploading file.');
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
      {fileUrl && (
        <p>
          File uploaded to: <a href={fileUrl} target="_blank" rel="noopener noreferrer">{fileUrl}</a>
        </p>
      )}
    </div>
  );
};

export default FileUpload;
