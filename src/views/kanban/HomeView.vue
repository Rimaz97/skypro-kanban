<template>
  <div class="wrapper" :class="{ 'dark-theme': isDark }">
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
      v-if="showEditTaskModal && selectedTask"
      :task="selectedTask"
      :is-visible="true"
      @save="updateTask"
      @delete-task="deleteTask"
      @close="closeAllModals"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, provide, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TaskDesk from '@/components/kanban/TaskDesk.vue'
import ExitModal from '@/components/kanban/ExitModal.vue'
import NewCardModal from '@/components/kanban/NewCardModal.vue'
import TaskModal from '@/components/kanban/TaskModal.vue'
import EditTaskModal from '@/components/kanban/EditTaskModal.vue'
import { fetchWords, postWord, editWord, deleteWord } from '@/services/api'

const { user, removeUser } = inject('auth')
const route = useRoute()
const router = useRouter()
const tasks = ref([])
const selectedTask = ref(null)
const loading = ref(false)
const error = ref('')

provide('tasksData', { tasks, loading, error })

const isDark = inject('isDark')

const isAuthenticated = computed(() => !!user.value?.token)

const loadTasks = async () => {
  if (!isAuthenticated.value) return

  try {
    loading.value = true
    error.value = ''
    const data = await fetchWords(user.value.token)
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

watch(user, (val) => {
  if (val?.token) loadTasks()
})

const createTask = async (task) => {
  try {
    await postWord(task, user.value.token)
    await loadTasks()
    closeAllModals()
  } catch (err) {
    error.value = err.message
  }
}

const updateTask = async (updated) => {
  try {
    await editWord(updated._id, updated, user.value.token)
    await loadTasks()
    closeAllModals()
  } catch (err) {
    error.value = err.message
  }
}

const deleteTask = async (id) => {
  try {
    await deleteWord(id, user.value.token)
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
  [() => route.params.id, tasks],
  ([newId, newTasks]) => {
    if (newId && newTasks.length > 0) {
      selectedTask.value = newTasks.find((t) => String(t.id) === String(newId)) || null
    }
  },
  { immediate: true },
)

function goToAddTask() {
  router.push('/add-task')
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
  removeUser()
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

.home-view {
  min-height: 100vh;
  background: #eaeef6;
}

.dark-theme.home-view {
  background: #151419;
}
</style>
