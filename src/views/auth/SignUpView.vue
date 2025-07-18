<template>
  <div class="wrapper">
    <div class="container-signup">
      <div class="modal">
        <div class="modal__block">
          <div class="modal__ttl"><h2>Регистрация</h2></div>
          <form class="modal__form-login" @submit.prevent="handleSignUp">
            <input class="modal__input" v-model="firstName" placeholder="Имя" />
            <input class="modal__input" v-model="email" placeholder="Эл. почта" />
            <input class="modal__input" type="password" v-model="password" placeholder="Пароль" />
            <button class="modal__btn-signup-ent _hover01" type="submit">
              Зарегистрироваться
            </button>
            <div class="modal__form-group">
              <p>Уже есть аккаунт?
                <router-link to="/login">Войдите здесь</router-link>
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

const firstName = ref('')
const email     = ref('')
const password  = ref('')
const router    = useRouter()

function handleSignUp() {
  localStorage.setItem('userInfo', JSON.stringify({ firstName: firstName.value, email: email.value }))
  router.push('/')
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/signup.scss';
</style>
