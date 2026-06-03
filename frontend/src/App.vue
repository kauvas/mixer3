<template>
  <header class="cabecalho">
    <div class="header-inner">
      <div class="logo">
        <img src="./imagens/logo.png" alt="Mixer" class="logo-img" />
        Mixer
      </div>

      <div class="search">
        <input type="text" placeholder="Pesquisar musicas..." />
        <button>🔍</button>
      </div>

      <nav class="nav-links">
        <a href="#premium">Premium</a>
        <a href="#suporte">Suporte</a>
        <a href="#baixar">Baixar</a>
        <a href="#app">App</a>
        <a href="#login" class="btn-login">Entrar</a>
      </nav>
    </div>
  </header>

  <main class="page">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2 class="side-title">Sua Biblioteca</h2>
        <button class="btn-icon" title="Adicionar">+</button>
      </div>
      <nav class="sidebar-nav">
        <button class="btn-sidebar">📝 Criar Playlist</button>
        <div class="links">
          <a href="#legal" style="text-decoration: none"> Legal </a>
          <a href="#acessibilidade" style="text-decoration: none"> Acessibilidade </a>
          <a href="#cookies" style="text-decoration: none"> Cookies </a>
        </div>
        <button class="btn-sidebar">🌍 Alterar Idioma</button>
      </nav>
    </aside>
    <section class="music-section">
      <h2>Músicas em Destaque</h2>
      <div class="music-grid">
        <div v-for="music in musicas" :key="music.id" class="music-card">
          <div class="music-cover">
            <img :src="music.coverUrl" :alt="music.title" />
            <button class="play-btn">▶</button>
          </div>
          <p class="music-title">{{ music.title }}</p>
          <div class="artist-info">
            <img :src="music.artistImage" :alt="music.artist" class="artist-image" />
            <p class="artist-name">{{ music.artist }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="artists-section">
      <h2>Artistas em Destaque</h2>
      <div class="artists-grid">
        <div v-for="artist in artistas" :key="artist.id" class="artist-card">
          <div class="artist-avatar">
            <img :src="artist.image" :alt="artist.name" />
            <button class="follow-btn">Seguir</button>
          </div>
          <p class="artist-title">{{ artist.name }}</p>
          <p class="artist-genre">{{ artist.genre }}</p>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref } from "vue";

const musicas = ref([
  {
    id: 1,
    title: "Neon Nights",
    artist: "The Synthetics",
    coverUrl:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
    artistImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop",
  },
  {
    id: 2,
    title: "Electric Dreams",
    artist: "Luna & The Stars",
    coverUrl:
      "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300&h=300&fit=crop",
    artistImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
  },
  {
    id: 3,
    title: "Midnight Pulse",
    artist: "Digital Groove",
    coverUrl:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop",
    artistImage:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop",
  },
  {
    id: 4,
    title: "Vibrant Waves",
    artist: "Echo Chamber",
    coverUrl:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
    artistImage:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop",
  },
  {
    id: 5,
    title: "Cosmic Sounds",
    artist: "Space Cadets",
    coverUrl:
      "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300&h=300&fit=crop",
    artistImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
  },
  {
    id: 6,
    title: "Rhythm Rising",
    artist: "Beat Masters",
    coverUrl:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop",
    artistImage:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop",
  },
]);

const artistas = ref([
  {
    id: 1,
    name: "The Synthetics",
    genre: "Synthwave",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
  },
  {
    id: 2,
    name: "Luna & The Stars",
    genre: "Electronic",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
  },
  {
    id: 3,
    name: "Digital Groove",
    genre: "Techno",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
  },
  {
    id: 4,
    name: "Echo Chamber",
    genre: "Ambient",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
  },
  {
    id: 5,
    name: "Space Cadets",
    genre: "Cosmic Pop",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
  },
  {
    id: 6,
    name: "Beat Masters",
    genre: "Hip Hop",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
  },
]);
</script>
