<template>
  <div class="wrapper">
    <div class="container-signin">
      <div class="modal">
        <div class="modal__block">
          <div class="modal__ttl"><h2>Вход</h2></div>
          <form class="modal__form-login" @submit.prevent="handleLogin">
            <BaseInput
              v-model="form.login"
              type="email"
              placeholder="Эл. почта"
              required
            />

            <BaseInput
              v-model="form.password"
              type="password"
              placeholder="Пароль"
              required
            />

            <p v-if="error" class="error-message">{{ error }}</p>

            <button
              class="modal__btn-enter _hover01"
              type="submit"
              :disabled="loading"
            >
              {{ loading ? 'Загрузка...' : 'Войти' }}
            </button>

            <div class="modal__form-group">
              <p>Нужно зарегистрироваться?
                <router-link to="/register">Регистрируйтесь здесь</router-link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { signIn } from '@/services/auth'
import BaseInput from '@/components/ui/BaseInput.vue'

const form = ref({
  login: '',
  password: ''
});

const error = ref('')
const loading = ref(false)
const router = useRouter()

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    const { token, user } = await signIn({
      login: form.value.login,
      password: form.value.password
    });

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    router.push('/');
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/signin.scss';

.error-message {
  color: #ff5252;
  margin: 10px 0;
  text-align: center;
  font-size: 14px;
  background: #ffe6e6;
  padding: 8px;
  border-radius: 4px;
}
</style>
