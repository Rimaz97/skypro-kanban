<template>
  <div class="main__block">
    <div class="container">
      <div class="main__content">
        <div v-if="isLoading" class="loading-message">
          <div class="loading-spinner"></div>
          <p>Данные загружаются...</p>
        </div>

        <template v-else>
          <TaskColumn
            v-for="column in columns"
            :key="column.title"
            :title="column.title"
            :tasks="filteredTasks(column.title)"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import TaskColumn from './TaskColumn.vue';
import { tasksData } from '@/data/tasks';

export default {
  name: 'TaskDesk',
  components: { TaskColumn },
  setup() {
    const isLoading = ref(true);
    const tasks = ref([]);

    const columns = ref([
      { title: 'Без статуса' },
      { title: 'Нужно сделать' },
      { title: 'В работе' },
      { title: 'Тестирование' },
      { title: 'Готово' }
    ]);

    const filteredTasks = (status) => {
      return tasks.value.filter(task => task.status === status);
    };

    onMounted(() => {
      // Имитация загрузки данных с сервера
      setTimeout(() => {
        tasks.value = tasksData;
        isLoading.value = false;
      }, 2000);
    });

    return {
      isLoading,
      columns,
      filteredTasks
    };
  }
};
</script>

<style scoped>
.loading-message {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 300px;
  font-size: 18px;
  color: #333;
  gap: 15px;
}

.loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #7986ff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
