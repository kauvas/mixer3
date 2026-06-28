import Hls from 'hls.js';

// Aqui toca as músicas

export const TRACKS = [
  {
    id: 'audio1',
    title: 'Audio 1',
    subtitle: 'HLS gerado',
    src: 'http://localhost:3000/audios/hls/audio1/index.m3u8',
    type: 'hls'
  },
  {
    id: 'audio2',
    title: 'Audio 2',
    subtitle: 'HLS gerado',
    src: 'http://localhost:3000/audios/hls/audio2/index.m3u8',
    type: 'hls'
  }
];

export function createAudioPlayer(audioElement, track) {
  let hls = null;

  function destroy() {
    if (hls) {
      hls.destroy();
      hls = null;
    }
  }

  function load(onLoaded, onError) {
    destroy();

    if (track?.type === 'hls' && Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(track.src);
      hls.attachMedia(audioElement);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (onLoaded) onLoaded();
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (onError) onError(data);
      });
    } else if (track?.type === 'hls' && audioElement.canPlayType('application/vnd.apple.mpegurl')) {
      audioElement.src = track.src;
      if (onLoaded) onLoaded();
    } else if (track?.src) {
      audioElement.src = track.src;
      if (onLoaded) onLoaded();
    } else if (onError) {
      onError({ fatal: true, reason: 'unsupported' });
    }
  }

  return { load, destroy };
}
