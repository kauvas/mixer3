export const AUDIO_STREAM_CONFIG = Object.freeze({
  inputFileName: 'audio.mp3',
  outputDirectoryName: 'hls',
  outputManifestName: 'index.m3u8',
  segmentPattern: 'segment_%03d.ts',
  hlsTime: '6',
  hlsPlaylistType: 'vod',
  audioBitrate: '128k',
  audioCodec: 'aac'
});
