<template>
  <button
    :class="['base-button', buttonClass]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="button-loader"></span>
    <span v-else class="button-content">
      <slot></slot>
    </span>
  </button>
</template>

<script>
export default {
  name: 'BaseButton',
  props: {
    type: {
      type: String,
      default: 'primary',
      validator: value => ['primary', 'secondary', 'tertiary', 'danger'].includes(value)
    },
    disabled: Boolean,
    loading: Boolean
  },
  computed: {
    buttonClass() {
      return {
        'primary': this.type === 'primary',
        'secondary': this.type === 'secondary',
        'tertiary': this.type === 'tertiary',
        'danger': this.type === 'danger',
        'loading-state': this.loading
      };
    }
  },
  emits: ['click']
};
</script>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  outline: none;
  min-width: 100px;
  position: relative;
}

/* Стили для разных типов кнопок */
.primary {
  background-color: #565eef;
  color: white;
}

.primary:hover:not(:disabled) {
  background-color: #4549ca;
}

.secondary {
  background-color: #eaeef6;
  color: #565eef;
  border: 1px solid #d4dbe5;
}

.secondary:hover:not(:disabled) {
  background-color: #d4dbe5;
}

.tertiary {
  background-color: transparent;
  color: #565eef;
  border: 1px solid #565eef;
}

.tertiary:hover:not(:disabled) {
  background-color: #f0f2ff;
}

.danger {
  background-color: #ff4d4f;
  color: white;
}

.danger:hover:not(:disabled) {
  background-color: #d9363e;
}

/* Состояния */
.base-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-state {
  opacity: 0.8;
  cursor: wait;
}

/* Индикатор загрузки */
.button-loader {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
}

.tertiary .button-loader,
.secondary .button-loader {
  border-top-color: #565eef;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.button-content {
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>
