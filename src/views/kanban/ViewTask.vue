<template>
  <div>
    <h1>Просмотр задачи</h1>
    <TaskModal :task="task" :isVisible="true" @close="closeModal" />
  </div>
</template>

<script>
import TaskModal from '@/components/kanban/TaskModal.vue';
import { ref } from 'vue';

export default {
  name: 'ViewTask',
  components: { TaskModal },
  setup() {
    const task = ref({ /* Данные задачи */ });

    const closeModal = () => {
      // Закрытие модального окна
    }

    return { task, closeModal };
  }
}
</script>
