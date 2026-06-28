import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { AUDIO_STREAM_CONFIG } from '../domain/audioStreamConfig.js';

export function convertAudioToHls() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const inputAudio = path.resolve(__dirname, '..', 'source', AUDIO_STREAM_CONFIG.inputFileName);
  const outputDir = path.resolve(__dirname, '..', AUDIO_STREAM_CONFIG.outputDirectoryName);
  const outputM3u8 = path.join(outputDir, AUDIO_STREAM_CONFIG.outputManifestName);

  if (!fs.existsSync(inputAudio)) {
    console.error('\nERRO: coloque seu áudio em:');
    console.error(inputAudio);
    console.error(`\nO nome do arquivo precisa ser: ${AUDIO_STREAM_CONFIG.inputFileName}\n`);
    process.exit(1);
  }

  fs.rmSync(outputDir, { recursive: true, force: true });
  fs.mkdirSync(outputDir, { recursive: true });

  const args = [
    '-i', inputAudio,
    '-vn',
    '-c:a', AUDIO_STREAM_CONFIG.audioCodec,
    '-b:a', AUDIO_STREAM_CONFIG.audioBitrate,
    '-hls_time', AUDIO_STREAM_CONFIG.hlsTime,
    '-hls_playlist_type', AUDIO_STREAM_CONFIG.hlsPlaylistType,
    '-hls_segment_filename', path.join(outputDir, AUDIO_STREAM_CONFIG.segmentPattern),
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
}

const isDirectExecution = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectExecution) {
  convertAudioToHls();
}
