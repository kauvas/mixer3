<template>
  <div class="auth-shell">
    <div class="auth-card">
      <h2>{{ isLogin ? 'Entrar' : 'Criar conta' }}</h2>
      <form @submit.prevent="submitForm">
        <label>
          E-mail
          <input v-model="email" type="email" required />
        </label>
        <label>
          Senha
          <input v-model="password" type="password" required />
        </label>
        <button type="submit">{{ isLogin ? 'Entrar' : 'Cadastrar' }}</button>
      </form>
      <p class="toggle-text">
        {{ isLogin ? 'Ainda não tem conta?' : 'Já tem conta?' }}
        <button type="button" @click="isLogin = !isLogin">
          {{ isLogin ? 'Cadastre-se' : 'Entrar' }}
        </button>
      </p>
      <p v-if="message" class="message">{{ message }}</p>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { loginUser, registerUser } from '../services/authService.js';

const emit = defineEmits(['authenticated']);
const isLogin = ref(true);
const email = ref('');
const password = ref('');
const message = ref('');
const error = ref('');

async function submitForm() {
  error.value = '';
  message.value = '';

  try {
    const result = isLogin.value
      ? await loginUser(email.value, password.value)
      : await registerUser(email.value, password.value);

    message.value = result.message || 'Operação realizada com sucesso';
    emit('authenticated');
  } catch (err) {
    error.value = err.message;
  }
}
</script>

<style scoped>
.auth-shell {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #120722, #2d1b4e);
  color: white;
  padding: 24px;
}
.auth-card {
  width: min(100%, 420px);
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 12px 32px rgba(0,0,0,0.25);
}
form { display: flex; flex-direction: column; gap: 12px; margin-top: 16px; }
label { display: flex; flex-direction: column; gap: 6px; font-weight: 600; }
input { padding: 10px 12px; border-radius: 8px; border: none; }
button { padding: 10px 12px; border: none; border-radius: 8px; cursor: pointer; font-weight: 700; }
button[type="submit"] { background: #0099ff; color: white; }
.toggle-text { margin-top: 12px; font-size: 14px; }
.toggle-text button { background: transparent; color: #8fd1ff; padding: 0; }
.message { color: #7ef2a0; margin-top: 12px; }
.error { color: #ff8f8f; margin-top: 12px; }
</style>
