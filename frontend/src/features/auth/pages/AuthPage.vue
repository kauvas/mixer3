<template>
  <AuthForm @authenticated="goToPlayer" />
</template>

<script setup>
import { useRouter } from 'vue-router';
import AuthForm from '../components/AuthForm.vue';

const router = useRouter();

function goToPlayer() {
  router.push('/');
}
</script>
