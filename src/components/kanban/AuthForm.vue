<template>
  <div class="modal__block">
    <div class="modal__ttl">
      <h2>{{ title }}</h2>
    </div>

    <form class="modal__form-login" @submit.prevent="handleSubmit">
      <!-- Поле имени (только для регистрации) -->
      <input
        v-if="isSignUp"
        v-model="name"
        class="modal__input"
        type="text"
        placeholder="Имя"
        required
      />

      <!-- Поле email -->
      <input
        v-model="email"
        class="modal__input"
        type="email"
        placeholder="Эл. почта"
        required
      />

      <!-- Поле пароля -->
      <input
        v-model="password"
        class="modal__input"
        type="password"
        placeholder="Пароль"
        required
      />

      <!-- Подтверждение пароля (только для регистрации) -->
      <input
        v-if="isSignUp"
        v-model="confirmPassword"
        class="modal__input"
        type="password"
        placeholder="Повторите пароль"
        required
      />

      <button type="submit" class="modal__btn-signup-ent _hover01">
        {{ buttonText }}
      </button>
    </form>

    <div class="modal__form-group">
      <p>{{ footerText }}</p>
      <router-link :to="footerLink">{{ footerLinkText }}</router-link>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';

export default defineComponent({
  name: 'AuthForm',
  props: {
    type: {
      type: String,
      default: 'signin',
      validator: value => ['signin', 'signup'].includes(value)
    }
  },
  emits: ['submit'], // Явно объявляем событие
  setup(props, { emit }) {
    const name = ref('');
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');

    const isSignUp = computed(() => props.type === 'signup');
    const title = computed(() => isSignUp.value ? 'Регистрация' : 'Вход');
    const buttonText = computed(() => isSignUp.value ? 'Зарегистрироваться' : 'Войти');
    const footerText = computed(() => isSignUp.value ? 'Уже есть аккаунт?' : 'Еще нет аккаунта?');
    const footerLink = computed(() => isSignUp.value ? '/sign-in' : '/sign-up');
    const footerLinkText = computed(() => isSignUp.value ? 'Войдите здесь' : 'Зарегистрируйтесь');

    const handleSubmit = () => {
      if (isSignUp.value && password.value !== confirmPassword.value) {
        alert('Пароли не совпадают!');
        return;
      }

      const formData = {
        name: name.value,
        email: email.value,
        password: password.value
      };

      // Испускаем событие с данными формы
      emit('submit', formData);
    };

    return {
      name,
      email,
      password,
      confirmPassword,
      isSignUp,
      title,
      buttonText,
      footerText,
      footerLink,
      footerLinkText,
      handleSubmit
    };
  }
});
</script>
