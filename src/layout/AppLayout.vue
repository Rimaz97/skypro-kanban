<template>
  <div class="wrapper">
    <BaseHeader
      @open-new-card="goToAddTask"
      @open-exit="goToExit"
      v-if="showHeader && isAuthReady"
    />
    <RouterView />
    <!-- основной контент -->
    <RouterView name="modal" />
    <!-- модалки -->
  </div>
</template>

<script setup>
import { provide, ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '@/firebase'
import BaseHeader from '@/components/kanban/BaseHeader.vue'

const router = useRouter()
const route = useRoute()
const showHeader = computed(() => !['/login', '/register'].includes(route.path))

// Пользователь и флаг «Firebase уже ответил, авторизован или нет»
const userInfo = ref(null)
const isAuthReady = ref(false)

// setUser для совместимости со SignInView / SignUpView
function setUserInfo(value) {
  userInfo.value = value?.user ?? value ?? null
}

// removeUser выходит из Firebase
async function removeUserInfo() {
  try {
    await signOut(auth)
  } catch (e) {
    console.error('signOut error:', e)
  }
  // userInfo обнулится сам в onAuthStateChanged
}

provide('auth', {
  user: userInfo,
  isAuthReady,
  setUser: setUserInfo,
  removeUser: removeUserInfo,
})

// Подписка на изменение состояния авторизации Firebase
let unsubscribe = null
onMounted(() => {
  unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      userInfo.value = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || '',
      }
    } else {
      userInfo.value = null
    }
    isAuthReady.value = true
  })
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})

function goToAddTask() {
  router.push('/add-task')
}

function goToExit() {
  router.push('/exit')
}
</script>
