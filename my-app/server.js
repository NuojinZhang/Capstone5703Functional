const express = require('express');
const next = require('next');
const multer = require('multer');
const { PrismaClient } = require('@prisma/client');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const prisma = new PrismaClient();
const upload = multer({ dest: 'public/uploads/' });

app.prepare().then(() => {
  const server = express();

  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  // 文件上传路由
  server.post('/api/upload', upload.single('file'), async (req, res) => {
    console.log('File upload handled by Express.js');
    const { file } = req;
    if (!file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    try {
      console.log('Saving file to database:', {
        filename: file.originalname,
        filepath: `/uploads/${file.filename}`,
      });

      // 保存文件信息到数据库
      const savedFile = await prisma.file.create({
        data: {
          filename: file.originalname,
          filepath: `/uploads/${file.filename}`,
        },
      });

      res.status(200).json({ success: true, file: savedFile });
    } catch (error) {
      console.error('Error saving file to database:', error);
      res.status(500).json({ success: false, error: 'Error saving file to database' });
    }
  });

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
