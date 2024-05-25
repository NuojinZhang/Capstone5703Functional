const express = require('express');
const next = require('next');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const algoliasearch = require('algoliasearch');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const prisma = new PrismaClient();

const uploadDir = path.join(__dirname, 'public/uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const decodedFileName = decodeURIComponent(file.originalname)
    cb(null, decodedFileName)
  }
});

const upload = multer({ storage });

const client = algoliasearch('ANLFWNG46P', 'ca5cdb3cc6a354943a3deaae7d9e1b1b');
const index = client.initIndex('Upload_Search_Functional_Module');

app.prepare().then(() => {
  const server = express();

  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  server.post('/api/upload', upload.single('file'), async (req, res) => {
    console.log('File upload handled by Express.js');
    const { file } = req;
    if (!file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    try {
      const savedFile = await prisma.file.create({
        data: {
          filename: file.originalname,
          filepath: `/uploads/${file.originalname}`,
        },
      });

      const record = { objectID: savedFile.id, filename: file.originalname, filepath: `/uploads/${file.originalname}`, createdAt: new Date().toISOString() };
      await index.saveObject(record).wait();

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
