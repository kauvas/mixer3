import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Mudamos as pastas para "audios" e o arquivo para "audio.mp3" (ou .wav, .m4a)
const inputAudio = path.join(__dirname, 'audios', 'source', 'audio.mp3');
const outputDir = path.join(__dirname, 'audios', 'hls');
const outputM3u8 = path.join(outputDir, 'index.m3u8');

if (!fs.existsSync(inputAudio)) {
  console.error('\nERRO: coloque seu áudio em:');
  console.error(inputAudio);
  console.error('\nO nome do arquivo precisa ser: audio.mp3\n');
  process.exit(1);
}

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

// 2. Ajuste dos argumentos do FFmpeg
const args = [
  '-i', inputAudio,
  '-vn',                  // IGNORA O VÍDEO (fundamental para áudio-only)
  '-c:a', 'aac',          // Força o codec de áudio para AAC (melhor para HLS)
  '-b:a', '128k',         // Define o bitrate do áudio (ex: 128kbps para boa qualidade)
  '-hls_time', '6',
  '-hls_playlist_type', 'vod',
  '-hls_segment_filename', path.join(outputDir, 'segment_%03d.ts'),
  outputM3u8
];

console.log('\nConvertendo áudio para HLS...\n');

const ffmpeg = spawn('ffmpeg', args, { stdio: 'inherit' });

ffmpeg.on('close', (code) => {
  if (code === 0) {
    console.log('\nConversão de áudio finalizada!');
    console.log('Arquivo gerado:');
    console.log(outputM3u8);
    console.log('\nAgora rode: npm run dev\n');
  } else {
    console.error(`\nFFmpeg terminou com erro. Código: ${code}\n`);
  }
});