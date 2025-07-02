<template>
  <div class="wrapper">
    <div class="container-signin">
      <div class="modal">
        <AuthForm type="signin" :onClick="handleSignIn" />
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import AuthForm from '@/components/kanban/AuthForm.vue';

export default {
  name: 'SignInView',
  components: { AuthForm },
  setup() {
    const router = useRouter();

    async function handleSignIn(e) {
      e.preventDefault();
      localStorage.setItem('userInfo', 'true');
      router.push('/');
    }

    return {
      handleSignIn
    };
  }
};
</script>

<style scoped>
@import '@/assets/styles/signin.css';
</style>
