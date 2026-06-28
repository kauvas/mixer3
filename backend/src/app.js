import express from 'express';
import cors from 'cors';
import { registerHlsStatic } from './features/audios/infrastructure/hlsStaticServer.js';
import { registerAudioRoutes } from './features/audios/presentation/audioRoutes.js';
import { registerAuthRoutes } from './features/auth/presentation/authRoutes.js';

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  registerHlsStatic(app);
  registerAudioRoutes(app);
  registerAuthRoutes(app);
  return app;
}
