import Hls from 'hls.js';

export const TRACKS = [
  {
    id: 'radio',
    title: 'Rádio Ao Vivo',
    subtitle: 'Testando HLS',
    src: 'http://localhost:3000/audios/hls/index.m3u8',
    type: 'hls'
  },
  {
    id: 'sunset',
    title: 'Sunset Pulse',
    subtitle: 'Sample 01',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    type: 'audio'
  },
  {
    id: 'ocean',
    title: 'Ocean Drift',
    subtitle: 'Sample 02',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    type: 'audio'
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
