import express from 'express';
import { sendResponse } from '../../../shared/http/sendResponse.js';

export function registerAudioRoutes(app) {
  const router = express.Router();

  router.get('/', (_req, res) => {
    sendResponse(res, {
      message: 'Servidor HLS rodando',
      playerUrl: 'http://localhost:5173',
      hlsUrl: 'http://localhost:3000/audios/hls/index.m3u8'
    });
  });

  app.use('/', router);
}
