import { authenticateUser, registerUser, validateToken } from '../domain/authStore.js';

export function register({ email, password }) {
  return registerUser(email, password);
}

export function login({ email, password }) {
  return authenticateUser(email, password);
}

export function checkToken(token) {
  return validateToken(token);
}
