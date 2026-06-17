import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());

// CORREÇÃO 1: Apontar para a pasta 'audios' (não mais 'videos')
const hlsPath = path.join(__dirname, 'audios', 'hls');

// CORREÇÃO 2: Alterar a rota de '/stream' para '/audios/hls' para bater com o Vue
app.use('/audios/hls', (req, res, next) => {
  if (req.path.endsWith('.m3u8')) {
    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
  }

  if (req.path.endsWith('.ts')) {
    res.setHeader('Content-Type', 'video/mp2t');
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// Entrega os arquivos estáticos na rota correta
app.use('/audios/hls', express.static(hlsPath));

app.get('/', (req, res) => {
  res.json({
    message: 'Servidor HLS rodando',
    playerUrl: 'http://localhost:5173',
    hlsUrl: 'http://localhost:3000/audios/hls/index.m3u8' // Rota atualizada
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`HLS em: http://localhost:${PORT}/audios/hls/index.m3u8`);
});