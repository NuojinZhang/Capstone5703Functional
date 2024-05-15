// server.js
const express = require('express');
const next = require('next');
const multer = require('multer');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const prisma = new PrismaClient();
const upload = multer({ dest: 'public/uploads/' });

app.prepare().then(() => {
  const server = express();

  // 文件上传路由
  server.post('/api/upload', upload.single('file'), async (req, res) => {
    const { file } = req;
    if (!file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    // 保存文件信息到数据库
    const savedFile = await prisma.file.create({
      data: {
        filename: file.originalname,
        filepath: `/uploads/${file.filename}`,
      },
    });

    res.status(200).json({ success: true, file: savedFile });
  });

  // 处理所有其他请求
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
