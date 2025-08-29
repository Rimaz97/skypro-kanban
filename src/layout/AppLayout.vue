<template>
  <div class="wrapper">
    <BaseHeader @open-new-card="goToAddTask" @open-exit="goToExit" v-if="showHeader" />
    <RouterView />
    <!-- основной контент -->
    <RouterView name="modal" />
    <!-- модалки -->
  </div>
</template>

<script setup>
import { provide, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseHeader from '@/components/kanban/BaseHeader.vue'

const router = useRouter()
const route = useRoute()
const showHeader = computed(() => !['/login', '/register'].includes(route.path))

const userInfo = ref(null)

try {
  const saved = localStorage.getItem('userInfo')
  if (saved) {
    userInfo.value = JSON.parse(saved)
  }
} catch {
  userInfo.value = null
}

function setUserInfo(value) {
  userInfo.value = value
  try {
    localStorage.setItem('userInfo', JSON.stringify(value))
  } catch (e) {
    console.error('ошибка:', e)
    return null
  }
}

function removeUserInfo() {
  userInfo.value = null
  try {
    localStorage.removeItem('userInfo')
  } catch (e) {
    console.error('ошибка:', e)
  }
}

provide('auth', {
  user: userInfo,
  setUser: setUserInfo,
  removeUser: removeUserInfo,
})

function goToAddTask() {
  router.push('/add-task')
}

function goToExit() {
  router.push('/exit')
}
</script>
