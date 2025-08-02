<template>
  <input
    class="input"
    :class="{ 'dark-theme': isDark }"
    :type="type"
    :name="name"
    :id="id"
    :placeholder="placeholder"
    :value="modelValue"
    @input="updateValue"
  />
</template>

<script setup>
import { inject, defineProps, defineEmits } from 'vue'

const isDark = inject('isDark')

const { modelValue, type, name, id, placeholder } = defineProps({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  modelValue: {
    type: [String, Number],
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const updateValue = (event) => {
  emit('update:modelValue', event.target.value)
}
</script>

<style scoped>
.input {
  width: 100%;
  padding: 12px 15px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s, background 0.3s, color 0.3s;
  background: #fff;
  color: #000;
}

.input:focus {
  border-color: #565eef;
  outline: none;
}

.dark-theme.input {
  background: #2d2d3a;
  border-color: #4e5566;
  color: #fff;
}

.dark-theme.input:focus {
  border-color: #7986ff;
}

.dark-theme.input::placeholder {
  color: #b0b0b0;
}
</style>
