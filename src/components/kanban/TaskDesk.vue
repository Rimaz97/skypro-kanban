<template>
  <div class="main__block">
    <div class="container">
      <!-- Обёртка для центрирования -->
      <div class="content-wrapper">
        <!-- Лоадер -->
        <div v-if="isLoading" class="loading-state">
          <div class="loader-container">
            <div class="loader"></div>
            <p>Загрузка задач...</p>
          </div>
        </div>

        <!-- Пустое состояние -->
        <div v-else-if="totalTasks === 0" class="empty-state">
          <div class="empty-container">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#94A6BE" stroke-width="1.5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="8" y1="8" x2="16" y2="16"></line>
              <line x1="16" y1="8" x2="8" y2="16"></line>
            </svg>
            <h3>Задач нет</h3>
            <p>Начните с добавления первой задачи</p>
            <button @click="handleAddTask">+ Добавить задачу</button>
          </div>
        </div>

        <!-- Основной контент -->
        <template v-else>
          <div class="main__content">
            <TaskColumn
              v-for="column in columns"
              :key="column.title"
              :title="column.title"
              :tasks="filteredTasks(column.title)"
            />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
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

    const totalTasks = computed(() => tasks.value.length);
    const isEmpty = computed(() => totalTasks.value === 0);

    const filteredTasks = (status) => {
      return tasks.value.filter(task => task.status === status);
    };

    const handleAddTask = () => {
      console.log('Открытие модалки добавления задачи');
      // Здесь будет вызов модального окна
    };

    onMounted(() => {
      setTimeout(() => {
        // Для демонстрации пустого состояния:
        // tasks.value = [];

        // Для обычного режима:
        tasks.value = tasksData;

        isLoading.value = false;
      }, 2000);
    });

    return {
      isLoading,
      isEmpty,
      totalTasks,
      columns,
      filteredTasks,
      handleAddTask
    };
  }
};
</script>

<style scoped>
/* Обёртка для центрирования */
.content-wrapper {
  min-height: calc(100vh - 150px); /* Учитываем высоту шапки */
  display: flex;
  flex-direction: column;
}

/* Стили для состояний */
.loading-state,
.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loader-container,
.empty-container {
  text-align: center;
  max-width: 400px;
  padding: 40px;
}

/* Анимация лоадера */
.loader {
  width: 60px;
  height: 60px;
  margin: 0 auto 20px;
  border: 4px solid rgba(86, 94, 239, 0.2);
  border-top: 4px solid #565EEF;
  border-radius: 50%;
  animation: spin 1.5s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Стили пустого состояния */
.empty-state h3 {
  font-size: 24px;
  margin: 20px 0 10px;
  color: #333;
}

.empty-state p {
  color: #94A6BE;
  margin-bottom: 20px;
}

.empty-state button {
  padding: 12px 30px;
  background: #565EEF;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(86, 94, 239, 0.25);
}

.empty-state button:hover {
  background: #4549ca;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(86, 94, 239, 0.35);
}

/* Адаптация для темной темы */
.dark-theme .empty-state h3 {
  color: #e0e0e0;
}

.dark-theme .empty-state p {
  color: #a0aec0;
}

.dark-theme .loader {
  border-color: rgba(255, 255, 255, 0.2);
  border-top-color: #7986ff;
}
</style>
