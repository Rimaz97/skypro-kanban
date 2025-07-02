<template>
  <div class="wrapper">
    <div class="container-signup">
      <div class="modal">
        <AuthForm type="signup" :onClick="handleSignUp" />
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import AuthForm from '@/components/kanban/AuthForm.vue';

export default {
  name: 'SignUpView',
  components: { AuthForm },
  setup() {
    const router = useRouter();

    async function handleSignUp(e, formData) {
      e.preventDefault();
      console.log('Данные регистрации:', formData);
      localStorage.setItem('userInfo', 'true');
      router.push('/');
    }

    return {
      handleSignUp
    };
  }
};
</script>

<style scoped>
@import '@/assets/styles/signup.css';
</style>
