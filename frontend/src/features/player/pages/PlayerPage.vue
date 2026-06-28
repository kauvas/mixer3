<template>
  <div class="app-container">
    <header class="main-header">
      <div class="header-brand">
        <div class="brand-logo"></div>
        <button class="btn-home" aria-label="Home">🏠</button>
        <div class="search-container">
          <input type="text" placeholder="O que você quer ouvir?">
        </div>
      </div>
      <nav class="header-nav">
        <a href="#">Premium</a>
        <a href="#">Suporte</a>
        <a href="#">Baixar</a>
        <span style="color: #444;">|</span>
        <a href="#">⬇️ Instalar aplicativo</a>
        <a href="#">Inscrever-se</a>
        <a href="#" class="btn-login">Entrar</a>
      </nav>
    </header>

    <div class="app-body">
      <aside class="sidebar">
        <div class="sidebar-section">
          <div class="library-title">
            <span>📚 Sua biblioteca</span>
            <button style="background:none; border:none; color:inherit; cursor:pointer;">＋</button>
          </div>
          <div class="cta-box">
            <p style="font-weight: bold; font-size: 14px;">Crie sua playlist</p>
            <button class="btn-action">Criar playlist</button>
          </div>
        </div>

        <div class="sidebar-footer">
          <div class="legal-links">
            <a href="#" style="color:inherit; text-decoration:none;">Legal</a>
            <a href="#" style="color:inherit; text-decoration:none;">Acessibilidade</a>
            <a href="#" style="color:inherit; text-decoration:none;">Cookies</a>
          </div>
          <button class="btn-lang-selector">🌐 Português do Brasil</button>
        </div>
      </aside>

      <main class="content-feed">
        <section>
          <div class="feed-section-header">
            <h2>Músicas em alta</h2>
            <a href="#" class="view-all-link">Mostrar tudo</a>
          </div>

          <div class="data-grid" id="music-grid">
            <BaseCard
              v-for="track in tracks"
              :key="track.id"
              class="media-card"
              @click="playTrack(track)"
            >
              <div class="card-cover">▶ Play</div>
              <div class="card-details">
                <h4>{{ track.title }}</h4>
                <p>{{ track.subtitle }}</p>
              </div>
            </BaseCard>
          </div>
        </section>
      </main>
    </div>

    <footer class="main-footer">
      <AudioPlayer ref="audioPlayerRef" />
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AudioPlayer from '../components/AudioPlayer.vue';
import BaseCard from '../../../shared/components/BaseCard.vue';
import { TRACKS } from '../services/audioService.js';

const audioPlayerRef = ref(null);
const tracks = TRACKS;

function playTrack(track) {
  if (audioPlayerRef.value?.loadAudio) {
    audioPlayerRef.value.loadAudio(track);
  }
}
</script>

<style scoped>
.app-container {
  background-color: #000000;
  color: white;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.main-header {
  background-color: #1d0a34;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  height: 64px;
}

.header-brand { display: flex; align-items: center; gap: 15px; }
.brand-logo { width: 40px; height: 40px; background: linear-gradient(45deg, #ff00cc, #3333ff); border-radius: 50%; }
.btn-home { background-color: #242424; padding: 8px; border-radius: 50%; cursor: pointer; border: none; color: white; }
.search-container { position: relative; width: 350px; }
.search-container input { width: 100%; padding: 10px 40px 10px 15px; border-radius: 20px; border: none; background-color: #2c164d; color: white; outline: none; }
.header-nav { display: flex; align-items: center; gap: 20px; font-size: 14px; font-weight: bold; }
.header-nav a { color: #b3b3b3; text-decoration: none; }
.btn-login { background-color: white; color: black; padding: 10px 25px; border-radius: 20px; }

.app-body { display: flex; flex: 1; padding: 8px; gap: 8px; height: calc(100vh - 64px - 80px); }
.sidebar { width: 300px; background-color: #120722; border-radius: 8px; padding: 20px; display: flex; flex-direction: column; justify-content: space-between; }
.content-feed { flex: 1; overflow: auto; padding: 20px; background: #000; }
.feed-section-header { display: flex; justify-content: space-between; margin-bottom: 12px; }
.data-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px; }
.media-card { cursor: pointer; }
.card-cover { margin-bottom: 12px; }
.main-footer { background: #120722; }
</style>
