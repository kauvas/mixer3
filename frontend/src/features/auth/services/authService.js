const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'auth_user';

function persistSession(session) {
  if (session?.token) {
    localStorage.setItem(AUTH_TOKEN_KEY, session.token);
  }

  if (session?.email) {
    localStorage.setItem(AUTH_USER_KEY, session.email);
  }
}

export async function registerUser(email, password) {
  const response = await fetch('http://localhost:3000/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Erro ao cadastrar');
  }

  persistSession(data.session);
  return data;
}

export async function loginUser(email, password) {
  const response = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Erro ao entrar');
  }

  persistSession(data.session);
  return data;
}

export async function getCurrentUser() {
  const token = localStorage.getItem('auth_token');
  if (!token) return null;

  const response = await fetch('http://localhost:3000/auth/me', {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!response.ok) return null;
  return { authenticated: true };
}

export function getStoredUser() {
  return localStorage.getItem(AUTH_USER_KEY);
}

export function clearSession() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}
