<template>
  <div>
    <h1>Редактирование задачи</h1>
    <EditTaskModal @save="saveChanges" @close="closeModal" />
  </div>
</template>

<script>
import EditTaskModal from '@/components/kanban/EditTaskModal.vue'

export default {
  name: 'EditTaskView',
  components: { EditTaskModal },
  methods: {
    saveChanges(updatedTask) {
      // Логика для сохранения изменений задачи
      console.log('Задача обновлена:', updatedTask)
    },
    closeModal() {
      // Закрытие модального окна
    },
  },
}
</script>
