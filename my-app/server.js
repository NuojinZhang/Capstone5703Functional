// server.js
const express = require('express');
const next = require('next');
const multer = require('multer');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const sanitize = require('sanitize-filename'); 

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const prisma = new PrismaClient();
const upload = multer({ dest: 'public/uploads/' });

app.prepare().then(() => {
  const server = express();

  // 中间件用于解析 JSON 请求体
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  // 文件上传路由
  server.post('/api/upload', upload.single('file'), async (req, res) => {
    console.log('File upload handled by Express.js');
    const { file } = req;
    if (!file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    // 解码并清理文件名
    const originalName = decodeURIComponent(file.originalname);
    const sanitizedFilename = sanitize(originalName);

    const newFilePath = path.join('public/uploads/', sanitizedFilename);

    require('fs').renameSync(file.path, newFilePath);

    // 保存文件信息到数据库
    const savedFile = await prisma.file.create({
      data: {
        filename: sanitizedFilename,
        filepath: `/uploads/${sanitizedFilename}`,
      },
    });

    res.status(200).json({ success: true, file: savedFile });
  });

  // 处理所有其他请求并交给 Next.js
  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
