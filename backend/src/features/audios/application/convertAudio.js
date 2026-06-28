import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { AUDIO_STREAM_CONFIG } from '../domain/audioStreamConfig.js';

const AUDIO_EXTENSIONS = new Set(['.mp3', '.wav', '.m4a', '.aac', '.ogg', '.flac']);

function getAudioFiles(sourceDir) {
  if (!fs.existsSync(sourceDir)) {
    return [];
  }

  return fs.readdirSync(sourceDir)
    .filter((fileName) => AUDIO_EXTENSIONS.has(path.extname(fileName).toLowerCase()))
    .map((fileName) => path.join(sourceDir, fileName));
}

export function convertAudioToHls() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const sourceDir = path.resolve(__dirname, '..', 'source');
  const outputDir = path.resolve(__dirname, '..', AUDIO_STREAM_CONFIG.outputDirectoryName);

  const inputAudios = getAudioFiles(sourceDir);

  if (inputAudios.length === 0) {
    console.error('\nERRO: não foram encontrados arquivos de áudio em:');
    console.error(sourceDir);
    console.error('\nAdicione arquivos com extensão .mp3, .wav, .m4a, .aac, .ogg ou .flac.\n');
    process.exit(1);
  }

  fs.rmSync(outputDir, { recursive: true, force: true });
  fs.mkdirSync(outputDir, { recursive: true });

  console.log(`\nConvertendo ${inputAudios.length} arquivo(s) de áudio para HLS...\n`);

  const conversions = inputAudios.map((inputAudio) => {
    const fileName = path.basename(inputAudio, path.extname(inputAudio));
    const trackOutputDir = path.join(outputDir, fileName);
    fs.mkdirSync(trackOutputDir, { recursive: true });

    const outputM3u8 = path.join(trackOutputDir, AUDIO_STREAM_CONFIG.outputManifestName);
    const segmentPattern = path.join(trackOutputDir, AUDIO_STREAM_CONFIG.segmentPattern);

    return new Promise((resolve, reject) => {
      const args = [
        '-i', inputAudio,
        '-vn',
        '-c:a', AUDIO_STREAM_CONFIG.audioCodec,
        '-b:a', AUDIO_STREAM_CONFIG.audioBitrate,
        '-hls_time', AUDIO_STREAM_CONFIG.hlsTime,
        '-hls_playlist_type', AUDIO_STREAM_CONFIG.hlsPlaylistType,
        '-hls_segment_filename', segmentPattern,
        outputM3u8
      ];

      console.log(`Convertendo: ${path.basename(inputAudio)}`);

      const ffmpeg = spawn('ffmpeg', args, { stdio: 'inherit' });

      ffmpeg.on('close', (code) => {
        if (code === 0) {
          console.log(`Arquivo gerado: ${outputM3u8}`);
          resolve();
        } else {
          console.error(`\nFFmpeg terminou com erro para ${path.basename(inputAudio)}. Código: ${code}\n`);
          reject(new Error(`Falha na conversão de ${path.basename(inputAudio)}`));
        }
      });
    });
  });

  Promise.all(conversions)
    .then(() => {
      console.log('\nConversão de áudio finalizada!');
      console.log('\nAgora rode: npm run dev\n');
    })
    .catch((error) => {
      console.error(error.message);
      process.exit(1);
    });
}

const isDirectExecution = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectExecution) {
  convertAudioToHls();
}
