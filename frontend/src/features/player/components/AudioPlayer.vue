<template>
  <div class="player-shell">
    <div class="now-playing">
      <div class="track-info">
        <h4 v-if="currentTrack">🎵 {{ currentTrack.title }}</h4>
        <h4 v-else>Player pronto</h4>
        <p v-if="currentTrack">{{ currentTrack.subtitle }}</p>
      </div>
    </div>

    <div class="playback-buttons">
      <button @click="togglePlay" class="btn-play" :disabled="!isLoaded">
        {{ isPlaying ? '⏸ Pause' : '▶ Play' }}
      </button>
    </div>

    <div class="volume-controls">
      <span v-if="errorMessage" class="player-error">{{ errorMessage }}</span>
    </div>

    <audio ref="audioRef"></audio>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { createAudioPlayer } from '../services/audioService.js';

const audioRef = ref(null);
const errorMessage = ref('');
const isPlaying = ref(false);
const isLoaded = ref(false);
const currentTrack = ref(null);
let audioController = null;

function handleLoaded() {
  isLoaded.value = true;
  errorMessage.value = '';
  togglePlay();
}

function handleError(data) {
  console.error('Erro detalhado do player:', data);
  if (data?.fatal) {
    errorMessage.value = 'Erro crítico ao carregar o stream.';
  } else {
    errorMessage.value = 'Pequena falha na rede, tentando denovo...';
  }
}

function togglePlay() {
  if (!audioRef.value) return;

  if (audioRef.value.paused) {
    audioRef.value.play().catch(() => {
      errorMessage.value = 'O navegador bloqueou o áudio. Clique no botão de Play abaixo.';
      isPlaying.value = false;
    });
  } else {
    audioRef.value.pause();
  }
}

function loadAudio(track) {
  errorMessage.value = 'Carregando música...';
  currentTrack.value = track;

  if (!audioRef.value) return;

  audioController = createAudioPlayer(audioRef.value, track);
  audioController.load(handleLoaded, handleError);
}

onMounted(() => {
  if (audioRef.value) {
    audioRef.value.addEventListener('play', () => {
      isPlaying.value = true;
      errorMessage.value = '';
    });
    audioRef.value.addEventListener('pause', () => {
      isPlaying.value = false;
    });
  }
});

onBeforeUnmount(() => {
  if (audioController) {
    audioController.destroy();
  }
});

defineExpose({ loadAudio });
</script>

<style scoped>
.player-shell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 20px;
  background: #120722;
  color: white;
}

.now-playing p {
  color: #b9b9c8;
  font-size: 12px;
  margin-top: 4px;
}

.btn-play {
  border: none;
  border-radius: 999px;
  padding: 10px 18px;
  cursor: pointer;
  background: #0099ff;
  color: white;
}

.player-error {
  color: #ff5555;
  font-size: 12px;
  font-weight: bold;
}
</style>
