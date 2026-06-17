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

app.use(cors());

// LOG DE DEBUG: Vamos ver na janela do terminal o que o navegador está pedindo
app.use('/audios/hls', (req, res, next) => {
    console.log(`[Requisição] Pedido recebido para: ${req.path}`);
    console.log(`[Pasta Física] Procurando em: ${path.join(hlsPath, req.path)}`);
    next();
});

// Configuração nativa para o express.static reconhecer os tipos de arquivo
express.static.mime.define({
    'application/x-mpegURL': ['m3u8'],
    'video/MP2T': ['ts'] 
});

// Entrega os arquivos estáticos na rota correta
// O express.static DEVE vir antes ou junto com os tratamentos de erro
app.use('/audios/hls', express.static(hlsPath, {
    setHeaders: (res, filePath) => {
        // Garante CORS e Content-Type direto na entrega do arquivo estático
        res.setHeader('Access-Control-Allow-Origin', '*');
        if (filePath.endsWith('.m3u8')) {
            res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
        }
        if (filePath.endsWith('.ts')) {
            res.setHeader('Content-Type', 'video/mp2t');
        }
    }
}));

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