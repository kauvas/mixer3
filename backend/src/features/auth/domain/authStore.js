const users = new Map();
const tokens = new Map();

export function registerUser(email, password) {
  if (users.has(email)) {
    throw new Error('E-mail já cadastrado');
  }

  users.set(email, { email, password });
  return { email };
}

export function authenticateUser(email, password) {
  const user = users.get(email);

  if (!user || user.password !== password) {
    throw new Error('Credenciais inválidas');
  }

  const token = `token_${Math.random().toString(36).slice(2)}_${Date.now()}`;
  tokens.set(token, email);
  return { token, email };
}

export function validateToken(token) {
  return tokens.has(token);
}
