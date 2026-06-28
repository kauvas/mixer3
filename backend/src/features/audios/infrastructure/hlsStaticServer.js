import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

export function registerHlsStatic(app) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const hlsPath = path.resolve(__dirname, '..', 'hls');

  express.static.mime.define({
    'application/x-mpegURL': ['m3u8'],
    'video/MP2T': ['ts']
  });

  app.use('/audios/hls', (req, res, next) => {
    console.log(`[Requisição] Pedido recebido para: ${req.path}`);
    console.log(`[Pasta Física] Procurando em: ${path.join(hlsPath, req.path)}`);
    next();
  });

  app.use('/audios/hls', express.static(hlsPath, {
    setHeaders: (res, filePath) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      if (filePath.endsWith('.m3u8')) {
        res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
      }
      if (filePath.endsWith('.ts')) {
        res.setHeader('Content-Type', 'video/mp2t');
      }
    }
  }));
}
