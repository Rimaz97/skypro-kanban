<template>
  <input
    class="input"
    :type="type"
    :name="name"
    :id="id"
    :placeholder="placeholder"
    v-model="modelValue"
    @input="updateValue"
  />
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
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
});

const emit = defineEmits(['update:modelValue']);

const modelValue = ref(props.modelValue);

// Обновляем родительский компонент при изменении значения
const updateValue = (event) => {
  modelValue.value = event.target.value;
  emit('update:modelValue', modelValue.value);
};

// Реагируем на изменения извне
watch(() => props.modelValue, (newVal) => {
  modelValue.value = newVal;
});
</script>

<style scoped>
.input {
  width: 100%;
  padding: 12px 15px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.input:focus {
  border-color: #565eef;
  outline: none;
}
</style>
