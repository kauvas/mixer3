import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());

// Pasta onde ficam os arquivos HLS gerados pelo FFmpeg
const hlsPath = path.join(__dirname, 'videos', 'hls');

// Headers importantes para HLS
app.use('/stream', (req, res, next) => {
  if (req.path.endsWith('.m3u8')) {
    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
  }

  if (req.path.endsWith('.ts')) {
    res.setHeader('Content-Type', 'video/mp2t');
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.use('/stream', express.static(hlsPath));

app.get('/', (req, res) => {
  res.json({
    message: 'Servidor HLS rodando',
    playerUrl: 'http://localhost:5173',
    hlsUrl: 'http://localhost:3000/stream/index.m3u8'
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`HLS em: http://localhost:${PORT}/stream/index.m3u8`);
});
