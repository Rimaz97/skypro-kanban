<template>
  <div>
    <h1>Добавление задачи</h1>
    <!-- Реализация добавления задачи -->
    <NewCardModal @create-task="createTask" @close="closeModal" />
  </div>
</template>

<script>
import NewCardModal from '@/components/kanban/NewCardModal.vue';

export default {
  name: 'AddTaskView',
  components: { NewCardModal },
  methods: {
    createTask(newTask) {
      // Логика для создания задачи
      console.log('Создана новая задача:', newTask);
    },
    closeModal() {
      // Закрытие модального окна
    }
  }
}
</script>
