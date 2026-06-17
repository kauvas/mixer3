<template>
  <div class="app-container">
    
    <header class="main-header">
        <div class="header-brand">
            <div class="brand-logo"></div>
            <button class="btn-home" aria-label="Home">🏠</button>
            <div class="search-container">
                <input type="text" id="search-input" placeholder="O que você quer ouvir?">
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
                    <div class="media-card" data-type="music" @click="loadAudio">
                        <div class="card-cover">▶ Play</div>
                        <div class="card-details">
                            <h4>Rádio Ao Vivo</h4>
                            <p>Testando HLS</p>
                        </div>
                    </div>
                    <div class="media-card" data-type="music"><div class="card-cover">musica tal</div><div class="card-details"><h4>Arirang</h4><p>Fulano de tal</p></div></div>
                    <div class="media-card" data-type="music"><div class="card-cover">musica tal</div><div class="card-details"><h4>Arirang</h4><p>Fulano de tal</p></div></div>
                </div>
            </section>

            <section>
                <div class="feed-section-header">
                    <h2>Artistas populares</h2>
                    <a href="#" class="view-all-link">Mostrar tudo</a>
                </div>
                
                <div class="data-grid" id="artist-grid">
                    <div class="media-card" data-type="artist"><div class="card-cover">Fulano</div><div class="card-details"><h4>Artista Nome</h4><p>Artista</p></div></div>
                    <div class="media-card" data-type="artist"><div class="card-cover">Fulano</div><div class="card-details"><h4>Artista Nome</h4><p>Artista</p></div></div>
                </div>
            </section>
        </main>
    </div>

    <footer class="main-footer">
        <div class="player-controls">
            <div class="now-playing">
                <div class="track-info">
                   <h4 v-if="isPlaying">🎵 Tocando agora</h4>
                   <h4 v-else>Player pronto</h4>
                </div>
            </div>
            
            <div class="playback-buttons">
                <button @click="togglePlay" class="btn-play" :disabled="!isLoaded">
                    {{ isPlaying ? '⏸ Pause' : '▶ Play' }}
                </button>
            </div>
            
            <div class="volume-controls">
                <span v-if="errorMessage" style="color: #ff5555; font-size: 12px; font-weight: bold;">{{ errorMessage }}</span>
            </div>
        </div>
        
        <audio ref="audioRef"></audio>
    </footer>

  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import Hls from 'hls.js';

// ESTADOS DO PLAYER
const audioRef = ref(null);
const audioUrl = 'http://localhost:3000/audios/hls/index.m3u8';
const errorMessage = ref('');
const isPlaying = ref(false);
const isLoaded = ref(false);
let hls = null;

// CARREGA A MÚSICA (HLS)
function loadAudio() {
  errorMessage.value = 'Carregando música...';
  const audio = audioRef.value;

  if (!audio) return;

  // Limpa instância anterior se o usuário clicar de novo
  if (hls) {
    hls.destroy();
    hls = null;
  }

  // Verifica se o navegador suporta HLS via JS (Chrome, Firefox, Edge)
  if (Hls.isSupported()) {
    hls = new Hls();
    hls.loadSource(audioUrl);
    hls.attachMedia(audio);

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
        isLoaded.value = true;
        errorMessage.value = ''; 
        togglePlay(); // Tenta dar o play automático
    });

    hls.on(Hls.Events.ERROR, (event, data) => {
      console.error('Erro detalhado do HLS.js:', data);
      if (data.fatal) {
          errorMessage.value = 'Erro crítico ao carregar o stream.';
      } else {
          errorMessage.value = 'Pequena falha na rede, tentando denovo...';
      }
    });

  // Fallback para Safari (que suporta HLS nativamente)
  } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
    audio.src = audioUrl;
    isLoaded.value = true;
    errorMessage.value = '';
    togglePlay();
  } else {
    errorMessage.value = 'Seu navegador não suporta a tecnologia HLS.';
  }
}

// CONTROLA PLAY/PAUSE COM TRATAMENTO DE ERRO
function togglePlay() {
    if (!audioRef.value) return;
    
    if (audioRef.value.paused) {
        // Tenta dar o play. O navegador pode bloquear (Promise Rejection)
        audioRef.value.play().catch(error => {
            console.warn("Navegador bloqueou o Autoplay:", error);
            errorMessage.value = "O navegador bloqueou o áudio. Clique no botão de Play abaixo.";
            isPlaying.value = false;
        });
    } else {
        audioRef.value.pause();
    }
}

// MONITORA EVENTOS NATIVOS DO ÁUDIO
onMounted(() => {
    if (audioRef.value) {
        audioRef.value.addEventListener('play', () => {
            isPlaying.value = true;
            errorMessage.value = ''; // Limpa mensagens de erro se tocou
        });
        audioRef.value.addEventListener('pause', () => isPlaying.value = false);
    }
});

onBeforeUnmount(() => {
  if (hls) hls.destroy();
});
</script>

<style>
/* --- ESTILOS GLOBAIS --- */
:root {
    --bg-dark-primary: #120722;
    --bg-dark-secondary: #1d0a34;
    --bg-dark-card: #2d1b4e;
    --bg-light-content: #cccccc;
    --text-light: #ffffff;
    --text-dark: #000000;
    --text-muted: #555555;
    --accent-blue: #0099ff;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', system-ui, sans-serif;
}

.app-container {
    background-color: #000000;
    color: var(--text-light);
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
}

/* --- HEADER --- */
.main-header {
    background-color: var(--bg-dark-secondary);
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
.search-container input { width: 100%; padding: 10px 40px 10px 15px; border-radius: 20px; border: none; background-color: #2c164d; color: var(--text-light); outline: none; }
.search-container::after { content: '🔍'; position: absolute; right: 15px; top: 50%; transform: translateY(-50%); opacity: 0.7; }
.header-nav { display: flex; align-items: center; gap: 20px; font-size: 14px; font-weight: bold; }
.header-nav a { color: #b3b3b3; text-decoration: none; transition: color 0.2s; }
.header-nav a:hover { color: var(--text-light); }
.btn-login { background-color: var(--text-light); color: #000000; padding: 10px 25px; border-radius: 20px; text-decoration: none; transition: transform 0.2s; }
.btn-login:hover { transform: scale(1.05); }

/* --- BODY & SIDEBAR --- */
.app-body { display: flex; flex: 1; padding: 8px; gap: 8px; height: calc(100vh - 64px - 80px); }
.sidebar { width: 300px; background-color: var(--bg-dark-primary); border-radius: 8px; padding: 20px; display: flex; flex-direction: column; justify-content: space-between; }
.sidebar-section { display: flex; flex-direction: column; gap: 20px; }
.library-title { display: flex; justify-content: space-between; align-items: center; font-weight: bold; color: #b3b3b3; }
.cta-box { background-color: #24143e; padding: 16px; border-radius: 8px; display: flex; flex-direction: column; gap: 12px; }
.btn-action { background-color: var(--text-light); color: #000000; border: none; padding: 8px 16px; border-radius: 15px; font-weight: bold; cursor: pointer; align-self: flex-start; }
.sidebar-footer { display: flex; flex-direction: column; gap: 15px; }
.legal-links { display: flex; gap: 10px; font-size: 11px; color: #b3b3b3; }
.btn-lang-selector { background-color: transparent; color: var(--text-light); border: 1px solid #878787; padding: 8px 15px; border-radius: 20px; cursor: pointer; font-weight: bold; align-self: flex-start; }

/* --- CONTEÚDO --- */
.content-feed { flex: 1; background-color: var(--bg-light-content); border-radius: 8px; padding: 24px; color: var(--text-dark); overflow-y: auto; }
.feed-section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.feed-section-header h2 { font-size: 24px; font-weight: bold; }
.feed-section-header .view-all-link { font-size: 14px; font-weight: bold; color: #333; text-decoration: none; }
.data-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px; margin-bottom: 40px; }
.media-card { background-color: transparent; padding: 12px; border-radius: 6px; display: flex; flex-direction: column; gap: 10px; transition: background-color 0.2s; cursor: pointer; }
.media-card:hover, .media-card.active { outline: 2px solid var(--accent-blue); background-color: rgba(0, 153, 255, 0.1); }
.card-cover { width: 100%; aspect-ratio: 1; background-color: var(--bg-dark-card); color: #b3b3b3; display: flex; justify-content: center; align-items: center; font-size: 14px; }
.media-card[data-type="music"] .card-cover { border-radius: 6px; }
.media-card[data-type="artist"] .card-cover { border-radius: 50%; }
.card-details h4 { font-size: 16px; color: var(--text-dark); margin-bottom: 4px; }
.card-details p { font-size: 14px; color: var(--text-muted); }

/* --- FOOTER / PLAYER BAR --- */
.main-footer { 
    height: 80px; 
    background-color: #000; 
    width: 100%;
    border-top: 1px solid #282828;
    display: flex;
    justify-content: center;
    align-items: center;
}

.player-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 1200px;
    padding: 0 20px;
}

.now-playing, .volume-controls {
    width: 30%;
}

.playback-buttons {
    width: 40%;
    display: flex;
    justify-content: center;
}

.btn-play {
    background-color: var(--text-light);
    color: #000;
    border: none;
    border-radius: 50px;
    padding: 10px 25px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    transition: transform 0.1s;
}

.btn-play:hover { transform: scale(1.05); }
.btn-play:disabled { background-color: #555; cursor: not-allowed; transform: none; }
</style>