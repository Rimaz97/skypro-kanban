<template>
  <div class="wrapper">
    <BaseHeader @open-new-card="goToAddTask" @open-exit="goToExit" />

    <main class="main">
      <TaskDesk
        :tasks="tasks"
        :isLoadingProp="loading"
        :error="error"
        @open-task="goToViewTask"
        @add-task="goToAddTask"
      />
    </main>

    <div v-if="showOverlay" class="modal-overlay" @click.self="closeAllModals"></div>

    <ExitModal v-if="showExitModal" @confirm-exit="handleExit" @cancel-exit="closeAllModals" />

    <NewCardModal v-if="showNewCardModal" @create-task="createTask" @close="closeAllModals" />

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
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseHeader from '@/components/kanban/BaseHeader.vue'
import TaskDesk from '@/components/kanban/TaskDesk.vue'
import ExitModal from '@/components/kanban/ExitModal.vue'
import NewCardModal from '@/components/kanban/NewCardModal.vue'
import TaskModal from '@/components/kanban/TaskModal.vue'
import EditTaskModal from '@/components/kanban/EditTaskModal.vue'
import { fetchWords, postWord, editWord, deleteWord } from '@/services/api'

const route = useRoute()
const router = useRouter()
const tasks = ref([])
const selectedTask = ref(null)
const loading = ref(false)
const error = ref('')

const isAuthenticated = computed(() => {
  return !!localStorage.getItem('token')
})

const loadTasks = async () => {
  if (!isAuthenticated.value) return

  try {
    loading.value = true
    error.value = ''
    const data = await fetchWords()
    tasks.value = Array.isArray(data) ? data : []
  } catch (err) {
    error.value = err.message
    tasks.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (!isAuthenticated.value) {
    router.push('/login')
  } else {
    loadTasks()
  }
})

const createTask = async (task) => {
  try {
    await postWord(task)
    await loadTasks()
    closeAllModals()
  } catch (err) {
    error.value = err.message
  }
}

const updateTask = async (updated) => {
  try {
    await editWord(updated.id, updated)
    await loadTasks()
    closeAllModals()
  } catch (err) {
    error.value = err.message
  }
}

const deleteTask = async (id) => {
  try {
    await deleteWord(id)
    await loadTasks()
    closeAllModals()
  } catch (err) {
    error.value = err.message
  }
}

const showExitModal = computed(() => route.path === '/exit')
const showNewCardModal = computed(() => route.path === '/add-task')
const showTaskModal = computed(() => route.path.startsWith('/card/'))
const showEditTaskModal = computed(() => route.path.startsWith('/edit-task/'))

const showOverlay = computed(
  () =>
    showExitModal.value || showNewCardModal.value || showTaskModal.value || showEditTaskModal.value,
)

watch(
  () => route.params.id,
  (newId) => {
    if (newId != null) {
      selectedTask.value = tasks.value.find((t) => String(t.id) === String(newId)) || null
    }
  },
  { immediate: true },
)

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

function closeAllModals() {
  router.push('/')
}

function handleExit() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
}
</style>
