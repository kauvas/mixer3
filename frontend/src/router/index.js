import { createRouter, createWebHistory } from 'vue-router';
import PlayerPage from '../features/player/pages/PlayerPage.vue';
import AuthPage from '../features/auth/pages/AuthPage.vue';

const routes = [
  { path: '/', component: PlayerPage, meta: { requiresAuth: true } },
  { path: '/login', component: AuthPage }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('auth_token');
  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else {
    next();
  }
});

export default router;
