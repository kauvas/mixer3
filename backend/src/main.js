import { createApp } from './app.js';

const app = createApp();
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`HLS em: http://localhost:${PORT}/audios/hls/index.m3u8`);
});
