import Hls from 'hls.js';

// Aqui toca as músicas

export const TRACKS = [
  {
    id: 'AsItWas',
    title: 'As it was',
    subtitle: 'Harry Styles',
    src: 'http://localhost:3000/audios/hls/AsItWas/index.m3u8',
    type: 'hls'
  },
  {
    id: 'Flowers',
    title: 'Flowers',
    subtitle: 'Miley Cyrus',
    src: 'http://localhost:3000/audios/hls/Flowers/index.m3u8',
    type: 'hls'
  },
  {
    id: 'LovinOnMe',
    title: 'Lovin on me',
    subtitle: 'Jack Harlow',
    src: 'http://localhost:3000/audios/hls/LovinOnMe/index.m3u8',
    type: 'hls'
  },
  {
    id: 'TooSweet',
    title: 'Too sweet',
    subtitle: 'Hozier',
    src: 'http://localhost:3000/audios/hls/TooSweet/index.m3u8',
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
