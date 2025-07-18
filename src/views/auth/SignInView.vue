<template>
  <div class="wrapper">
    <div class="container-signin">
      <div class="modal">
        <div class="modal__block">
          <div class="modal__ttl"><h2>Вход</h2></div>
          <form class="modal__form-login" @submit.prevent="handleLogin">
            <input class="modal__input" type="email" v-model="email" placeholder="Эл. почта"/>
            <input class="modal__input" type="password" v-model="password" placeholder="Пароль"/>
            <button class="modal__btn-enter _hover01" type="submit">Войти</button>
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

const email    = ref('')
const password = ref('')
const router   = useRouter()

function handleLogin() {
  // здесь обычно запрос к API, но для примера просто сохраняем
  localStorage.setItem('userInfo', JSON.stringify({ email: email.value }))
  router.push('/')  // после успешного входа — на главную
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/signin.scss';
</style>
