<template>
  <div :class="{ 'dark-theme': isDark }">
    <BaseHeader />
    <router-view />
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'

const isDark = ref(false)

function toggleTheme() {
  isDark.value = !isDark.value
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

// Восстановление темы при загрузке
if (localStorage.getItem('theme') === 'dark') {
  isDark.value = true
}

// Provide состояние и функцию
provide('isDark', isDark)
provide('toggleTheme', toggleTheme)
</script>
