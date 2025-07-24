<template>
  <div class="wrapper">
    <!-- Шапка: кнопки «Создать» и «Выйти» -->
    <BaseHeader
      @open-new-card="goToAddTask"
      @open-exit="goToExit"
    />

    <!-- Основная доска -->
    <main class="main">
      <!-- TaskDesk эмитит событие 'open-task' с объектом task -->
      <TaskDesk @open-task="goToViewTask" />
    </main>

    <!-- Оверлей для затемнения, если любая модалка открыта -->
    <div
      v-if="showOverlay"
      class="modal-overlay"
      @click.self="closeAllModals"
    ></div>

    <!-- Модалки -->
    <ExitModal
      v-if="showExitModal"
      @confirm-exit="handleExit"
      @cancel-exit="closeAllModals"
    />

    <NewCardModal
      v-if="showNewCardModal"
      @create-task="createTask"
      @close="closeAllModals"
    />

    <TaskModal
      v-if="showTaskModal"
      :task="selectedTask"
      :is-visible="true"
      @delete-task="deleteTask"
      @close="closeAllModals"
      @open-edit="goToEditTask"
    />

    <EditTaskModal
      v-if="showEditTaskModal"
      :task="selectedTask"
      :is-visible="true"
      @save="updateTask"
      @delete-task="deleteTask"
      @close="closeAllModals"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import BaseHeader     from '@/components/kanban/BaseHeader.vue'
import TaskDesk       from '@/components/kanban/TaskDesk.vue'
import ExitModal      from '@/components/kanban/ExitModal.vue'
import NewCardModal   from '@/components/kanban/NewCardModal.vue'
import TaskModal      from '@/components/kanban/TaskModal.vue'
import EditTaskModal  from '@/components/kanban/EditTaskModal.vue'

// Данные задач для прямого доступа по ID
import { tasksData } from '@/data/tasks'

const route  = useRoute()
const router = useRouter()

// Текущая выбранная задача
const selectedTask = ref(null)

// Флаги модалок — управляются маршрутами
const showExitModal     = computed(() => route.path === '/exit')
const showNewCardModal  = computed(() => route.path === '/add-task')
const showTaskModal     = computed(() => route.path.startsWith('/card/'))
const showEditTaskModal = computed(() => route.path.startsWith('/edit-task/'))

// Оверлей показываем, если любая модалка открыта
const showOverlay = computed(() =>
  showExitModal.value ||
  showNewCardModal.value ||
  showTaskModal.value ||
  showEditTaskModal.value
)

// Когда URL меняется и там есть params.id — ищем задачу
watch(
  () => route.params.id,
  newId => {
    if (newId != null) {
      // приводим к строке на всякий случай
      selectedTask.value = tasksData.find(
        t => String(t.id) === String(newId)
      ) || null
    }
  },
  { immediate: true }
)

// Навигация «открыть модалку»
function goToAddTask() {
  router.push('/add-task')
}
function goToExit() {
  router.push('/exit')
}
function goToViewTask(task) {
  selectedTask.value = task
  router.push(`/card/${task.id}`)
}
function goToEditTask(task) {
  selectedTask.value = task
  router.push(`/edit-task/${task.id}`)
}

// Закрыть все модалки => вернуться на /
function closeAllModals() {
  router.push('/')
}

// Обработчики действий внутри модалок
function createTask(task) {
  console.log('Создана новая задача:', task)
  closeAllModals()
}

function updateTask(updated) {
  console.log('Задача обновлена:', updated)
  closeAllModals()
}

function deleteTask(id) {
  console.log('Удалена задача:', id)
  closeAllModals()
}

function handleExit() {
  console.log('Пользователь вышел из системы')
  localStorage.removeItem('userInfo')
  // При выходе отправляем на страницу логина
  router.push('/login')
}
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main {
  flex: 1;
}

/* затемнение фона */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  z-index: 100;
}
</style>
