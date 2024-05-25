'use client';

import React, { useState } from 'react';
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { Toaster } from "./ui/toaster";

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [selectedFile, setSelectedFile] = useState<string>("");
  const { toast } = useToast();

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
      setFile(null);
      setSelectedFile('');

      toast({
        title: "File Uploaded Successfully",
        description: (
          <div className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 text-white">
            File Name: {file.name}<br />
            Uploaded at: {new Date().toLocaleString()}
          </div>
        ),
      });
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "Error uploading file.",
      });
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
      <Toaster />

      <div className="file-upload-content">
        <input
          type="file"
          id="file-upload"
          onChange={handleFileChange}
          className="file-upload-input"
          style={{ display: 'none' }} 
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
    </div>
  );
};

export default FileUpload;
