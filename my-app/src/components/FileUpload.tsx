'use client';

import React, { useState } from 'react';
import { Button } from "./ui/button"; 

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setFile(file);
    setSelectedFile(file ? file.name : "");
  };

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
    <div
      className="file-upload-wrapper"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        textAlign: 'center',
      }}
    >
      <div className="file-upload-content">
        <input
          type="file"
          id="file-upload"
          onChange={handleFileChange}
          className="file-upload-input"
          style={{ display: 'none' }} // Hide the default input
        />
        <div className="file-upload-control">
          <Button asChild variant="outline" size="default" onClick={() => document.getElementById('file-upload')!.click()}>
            <span>Choose File</span>
          </Button>
          <span className="file-name px-3">{selectedFile || 'No file chosen'}</span>
        </div>
      </div>
      {selectedFile && (
        <div className="file-display-container mt-4">
          <form onSubmit={onSubmit}>
            <Button type="submit" variant="default">Upload File</Button>
          </form>
        </div>
      )}
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
