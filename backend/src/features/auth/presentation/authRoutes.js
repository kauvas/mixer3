import express from 'express';
import { login, register, checkToken } from '../application/authService.js';
import { sendResponse } from '../../../shared/http/sendResponse.js';

export function registerAuthRoutes(app) {
  const router = express.Router();

  router.post('/register', (req, res) => {
    try {
      const { email, password } = req.body;
      const user = register({ email, password });
      sendResponse(res, { user, message: 'Usuário cadastrado com sucesso' }, 201);
    } catch (error) {
      sendResponse(res, { error: error.message }, 400);
    }
  });

  router.post('/login', (req, res) => {
    try {
      const { email, password } = req.body;
      const session = login({ email, password });
      sendResponse(res, { session, message: 'Login realizado com sucesso' });
    } catch (error) {
      sendResponse(res, { error: error.message }, 401);
    }
  });

  router.get('/me', (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token || !checkToken(token)) {
      return sendResponse(res, { error: 'Token inválido' }, 401);
    }

    return sendResponse(res, { authenticated: true });
  });

  app.use('/auth', router);
}
