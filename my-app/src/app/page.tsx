// src/app/page.tsx
'use client';

import React from 'react';
import FileUpload from '../components/FileUpload';
import "./globals.css";

const Home: React.FC = () => {
  return (
    <div>
      <h1>File Upload</h1>
      <FileUpload />
    </div>
  );
};

export default Home;
