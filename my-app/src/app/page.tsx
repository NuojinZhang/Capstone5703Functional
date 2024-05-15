// src/pages/index.tsx
'use client';

import React from 'react';
import FileUpload from '@/components/FileUpload';
import Search from '@/components/Search';
import "./globals.css";

const Home: React.FC = () => {
  return (
    <div>
      <FileUpload />
      <Search />
    </div>
  );
};

export default Home;
