import express from 'express';
import cors from 'cors';
import { registerHlsStatic } from './features/audios/infrastructure/hlsStaticServer.js';
import { registerAudioRoutes } from './features/audios/presentation/audioRoutes.js';

export function createApp() {
  const app = express();
  app.use(cors());
  registerHlsStatic(app);
  registerAudioRoutes(app);
  return app;
}
