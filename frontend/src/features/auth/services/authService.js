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

  if (data.session?.token) {
    localStorage.setItem('auth_token', data.session.token);
  }

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
