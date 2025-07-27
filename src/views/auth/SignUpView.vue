<template>
  <div class="wrapper">
    <div class="container-signup">
      <div class="modal">
        <div class="modal__block">
          <div class="modal__ttl"><h2>Регистрация</h2></div>
          <form class="modal__form-login" @submit.prevent="handleSignUp">
            <!-- Используем BaseInput с v-model -->
            <BaseInput
              v-model="form.name"
              placeholder="Имя"
              required
            />

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
              class="modal__btn-signup-ent _hover01"
              type="submit"
              :disabled="loading"
            >
              {{ loading ? 'Загрузка...' : 'Зарегистрироваться' }}
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
import { signUp } from '@/services/auth'
import BaseInput from '@/components/ui/BaseInput.vue' // Импортируем компонент

const form = ref({
  name: '',
  login: '',
  password: ''
});

const error = ref('')
const loading = ref(false)
const router = useRouter()

async function handleSignUp() {
  error.value = ''
  loading.value = true
  try {
    await signUp({
      name: form.value.name,
      login: form.value.login,
      password: form.value.password
    });
    router.push('/login');
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
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
