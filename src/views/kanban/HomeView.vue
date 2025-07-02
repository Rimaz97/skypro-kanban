<template>
  <div class="wrapper">
    <BaseHeader @open-exit="showExitModal = true" @open-new-card="showNewCardModal = true" />

    <main class="main">
      <TaskDesk @open-task="openTaskModal" />
    </main>

    <!-- Оверлей для модалок -->
    <div v-if="showOverlay" class="modal-overlay" @click.self="closeAllModals"></div>

    <!-- Модальные окна -->
    <ExitModal
      v-if="showExitModal"
      @confirm-exit="handleExit"
      @cancel-exit="showExitModal = false"
    />

    <NewCardModal
      v-if="showNewCardModal"
      @create-task="createTask"
      @close="showNewCardModal = false"
    />

    <TaskModal
      v-if="showTaskModal"
      :task="selectedTask"
      :is-visible="showTaskModal"
      @delete-task="deleteTask"
      @close="showTaskModal = false"
      @open-edit="openEditModal"
    />

    <EditTaskModal
      v-if="showEditTaskModal"
      :task="selectedTask"
      :is-visible="showEditTaskModal"
      @save="updateTask"
      @delete-task="deleteTask"
      @close="showEditTaskModal = false"
    />
  </div>
</template>

<script>
import BaseHeader from '@/components/kanban/BaseHeader.vue'
import TaskDesk from '@/components/kanban/TaskDesk.vue'
import ExitModal from '@/components/kanban/ExitModal.vue'
import NewCardModal from '@/components/kanban/NewCardModal.vue'
import TaskModal from '@/components/kanban/TaskModal.vue'
import EditTaskModal from '@/components/kanban/EditTaskModal.vue'
import { ref, computed } from 'vue'

export default {
  name: 'HomeView',
  components: {
    BaseHeader,
    TaskDesk,
    ExitModal,
    NewCardModal,
    TaskModal,
    EditTaskModal,
  },
  setup() {
    const showExitModal = ref(false)
    const showNewCardModal = ref(false)
    const showTaskModal = ref(false)
    const showEditTaskModal = ref(false)
    const selectedTask = ref(null)

    const showOverlay = computed(() => {
      return (
        showExitModal.value ||
        showNewCardModal.value ||
        showTaskModal.value ||
        showEditTaskModal.value
      )
    })

    const openTaskModal = (task) => {
      selectedTask.value = task
      showTaskModal.value = true
    }

    const openEditModal = (task) => {
      selectedTask.value = task
      showTaskModal.value = false
      showEditTaskModal.value = true
    }

    const createTask = (task) => {
      console.log('Создана новая задача:', task)
      showNewCardModal.value = false
    }

    const updateTask = (updatedTask) => {
      console.log('Задача обновлена:', updatedTask)
      showEditTaskModal.value = false
    }

    const deleteTask = (taskId) => {
      console.log('Удалена задача:', taskId)
      showTaskModal.value = false
      showEditTaskModal.value = false
    }

    const handleExit = () => {
      console.log('Пользователь вышел из системы')
      showExitModal.value = false
    }

    const closeAllModals = () => {
      showExitModal.value = false
      showNewCardModal.value = false
      showTaskModal.value = false
      showEditTaskModal.value = false
    }

    return {
      showExitModal,
      showNewCardModal,
      showTaskModal,
      showEditTaskModal,
      showOverlay,
      selectedTask,
      openTaskModal,
      openEditModal,
      createTask,
      updateTask,
      deleteTask,
      handleExit,
      closeAllModals,
    }
  },
}
</script>

<style scoped>
/* Добавляем для корректного растягивания */
.wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main {
  flex: 1;
}

/* Оверлей для затемнения фона */
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
