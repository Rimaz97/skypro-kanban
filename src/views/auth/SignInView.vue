<template>
  <div class="wrapper">
    <div class="container-signin">
      <div class="modal">
        <div class="modal__block">
          <div class="modal__ttl">
            <h2>Вход</h2>
          </div>
          <form class="modal__form-login" @submit.prevent="handleLogin">
            <input
              class="modal__input"
              type="email"
              placeholder="Эл. почта"
              v-model="email"
              required
            >
            <input
              class="modal__input"
              type="password"
              placeholder="Пароль"
              v-model="password"
              required
            >
            <button class="modal__btn-enter _hover01" type="submit">
              Войти
            </button>
            <div class="modal__form-group">
              <p>Нужно зарегистрироваться?</p>
              <router-link to="/signup">Регистрируйтесь здесь</router-link>
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

const email = ref('')
const password = ref('')
const router = useRouter()

const handleLogin = () => {
  // Реальная аутентификация будет здесь
  localStorage.setItem('authToken', 'dummy_token')
  router.push('/')
}
</script>

<style lang="scss">
@import '@/assets/styles/signin.scss';

[data-theme="dark"] {
  @import '@/assets/styles/signin_dark.scss';
}
</style>
