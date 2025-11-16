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
      v-if="showEditTaskModal && selectedTask"
      :task="selectedTask"
      :is-visible="true"
      @save="updateTask"
      @delete-task="deleteTask"
      @close="closeAllModals"
    />

    <NotificationModal
      v-if="showNotificationModal"
      :title="notificationTitle"
      :message="notificationMessage"
      @close="hideNotification"
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
import NotificationModal from '@/components/ui/NotificationModal.vue'
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
    tasks.value = Array.isArray(data) ? [...data] : []
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
    if (!task.title || !task.topic || !task.date) {
      return;
    }

    const newTask = await postWord(task, user.value.token);
    tasks.value = [newTask, ...tasks.value];
    closeAllModals();
  } catch (err) {
    error.value = err.message;
  }
}

const updateTask = async (updated) => {
  try {
    const updatedTask = await editWord(updated._id, updated, user.value.token);
    const taskIndex = tasks.value.findIndex(task => task._id === updated._id);
    if (taskIndex !== -1) {
      tasks.value = [
        ...tasks.value.slice(0, taskIndex),
        { ...updatedTask },
        ...tasks.value.slice(taskIndex + 1)
      ];
    } else {
      tasks.value = [updatedTask, ...tasks.value];
    }

    if (selectedTask.value && selectedTask.value._id === updated._id) {
      selectedTask.value = { ...updatedTask };
    }

    closeAllModals();
  } catch (err) {
    error.value = err.message;
  }
}

const deleteTask = async (id) => {
  try {
    await deleteWord(id, user.value.token)
    tasks.value = tasks.value.filter((task) => task._id !== id)

    if (selectedTask.value && selectedTask.value._id === id) {
      selectedTask.value = null
    }

    closeAllModals()
  } catch (err) {
    error.value = err.message
  }
}

const showExitModal = computed(() => route.path === '/exit')
const showNewCardModal = computed(() => route.path === '/add-task')
const showTaskModal = computed(() => route.path.startsWith('/card/') && selectedTask.value !== null)
const showEditTaskModal = computed(
  () => route.path.startsWith('/edit-task/') && selectedTask.value !== null && selectedTask.value,
)

const showOverlay = computed(
  () =>
    showExitModal.value || showNewCardModal.value || showTaskModal.value || showEditTaskModal.value,
)

const showNotificationModal = ref(false)
const notificationTitle = ref('')
const notificationMessage = ref('')

const hideNotification = () => {
  showNotificationModal.value = false
}

watch(
  [() => route.params.id, tasks],
  ([newId, newTasks]) => {
    if (newId && newTasks.length > 0) {
      selectedTask.value = newTasks.find((t) => String(t._id) === String(newId)) || null

      if (
        !selectedTask.value &&
        (route.path.startsWith('/card/') || route.path.startsWith('/edit-task/'))
      ) {
        router.push('/')
      }
    }
  },
  { immediate: true },
)

function goToAddTask() {
  router.push('/add-task')
}

function goToViewTask(task) {
  selectedTask.value = task
  router.push(`/card/${task._id}`)
}

function goToEditTask(task) {
  selectedTask.value = task
  router.push(`/edit-task/${task._id}`)
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
