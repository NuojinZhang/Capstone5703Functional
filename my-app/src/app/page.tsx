// src/pages/index.tsx
'use client';

import React from 'react';
import FileUpload from '@/components/FileUpload';
import Search from '@/components/Search';
import "./globals.css";

const Home: React.FC = () => {
  return (
    <div>
      <h1>File Upload</h1>
      <FileUpload />
      <h2>Search Files</h2>
      <Search />
    </div>
  );
};

export default Home;
