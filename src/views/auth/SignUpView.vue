<template>
  <div class="wrapper">
    <div class="container-signup">
      <div class="modal">
        <div class="modal__block">
          <div class="modal__ttl"><h2>Регистрация</h2></div>
          <form class="modal__form-login" @submit.prevent="handleSignUp">
            <!-- Используем BaseInput с v-model -->
            <BaseInput
              id="signup-name"
              name="name"
              v-model="form.name"
              placeholder="Имя"
              required
            />

            <BaseInput
              id="signup-email"
              name="email"
              v-model="form.login"
              type="email"
              placeholder="Эл. почта"
              required
            />

            <BaseInput
              id="signup-password"
              name="password"
              v-model="form.password"
              type="password"
              placeholder="Пароль"
              required
            />

            <p v-if="error" class="error-message">{{ error }}</p>

            <button class="modal__btn-signup-ent _hover01" type="submit" :disabled="loading">
              {{ loading ? 'Загрузка...' : 'Зарегистрироваться' }}
            </button>

            <div class="modal__form-group">
              <p>
                Уже есть аккаунт?
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
import { inject } from 'vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { signUp } from '@/services/auth'
import BaseInput from '@/components/ui/BaseInput.vue'

const { setUser } = inject('auth')

const form = ref({
  name: '',
  login: '',
  password: '',
})

const error = ref('')
const loading = ref(false)
const router = useRouter()

async function handleSignUp() {
  error.value = ''
  loading.value = true
  try {
    const { user } = await signUp({
      name: form.value.name,
      login: form.value.login,
      password: form.value.password,
    })

    setUser({ user })

    router.push('/')
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/signup.scss';

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
