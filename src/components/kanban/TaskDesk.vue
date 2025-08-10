<template>
  <div class="desk" :class="{ 'dark-theme': isDark }">
  <div class="main__block">
    <div class="container">
      <div class="main__content">
        <!-- Лоадер -->
          <div v-if="isLoadingProp" class="loading-state">
          <div class="loader-container">
            <div class="loader"></div>
            <p>Загрузка задач...</p>
          </div>
        </div>

        <!-- Отображение ошибки -->
        <div v-else-if="error" class="error-state">
          <div class="error-container">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ff5252"
              stroke-width="1.5"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h3>Ошибка загрузки</h3>
            <p>{{ error }}</p>
            <button @click="$emit('reload')">Повторить попытку</button>
          </div>
        </div>

        <!-- Пустое состояние -->
        <div v-else-if="tasks.length === 0" class="empty-state">
          <div class="empty-container">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#94A6BE"
              stroke-width="1.5"
            >
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
          <TaskColumn
            v-for="column in columns"
            :key="column.title"
            :title="column.title"
            :tasks="filteredTasks(column.title)"
            @open-task="openTask"
          />
        </template>
      </div>
    </div>
  </div>
  </div>

</template>

<script setup>
import { ref, inject, defineProps, defineEmits } from 'vue'
import TaskColumn from './TaskColumn.vue'

// Props
const props = defineProps({
  tasks: {
    type: Array,
    default: () => []
  },
  isLoadingProp: Boolean,
  error: String
})

// Emits
const emit = defineEmits(['add-task', 'open-task', 'reload'])

// Inject theme
const isDark = inject('isDark')

// Reactive data
const columns = ref([
  { title: 'Без статуса' },
  { title: 'Нужно сделать' },
  { title: 'В работе' },
  { title: 'Тестирование' },
  { title: 'Готово' },
])

// Computed

// Methods
const filteredTasks = (status) => {
  return props.tasks.filter((task) => task.status === status)
}

const handleAddTask = () => {
  emit('add-task')
}

const openTask = (task) => {
  emit('open-task', task)
}
</script>

<style scoped>
/* Обёртка для центрирования */
.content-wrapper {
  min-height: calc(100vh - 150px);
  display: flex;
  flex-direction: column;
}

/* Стили для состояний */
.loading-state,
.empty-state,
.error-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loader-container,
.empty-container,
.error-container {
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
  border-top: 4px solid #565eef;
  border-radius: 50%;
  animation: spin 1.5s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Стили пустого состояния */
.empty-state h3,
.error-state h3 {
  font-size: 24px;
  margin: 20px 0 10px;
  color: #333;
}

.dark-theme .empty-state h3,
.dark-theme .error-state h3 {
  color: #e0e0e0;
}

.empty-state p,
.error-state p {
  color: #94a6be;
  margin-bottom: 20px;
}

.dark-theme .empty-state p,
.dark-theme .error-state p {
  color: #a0aec0;
}

.empty-state button,
.error-state button {
  padding: 12px 30px;
  background: #565eef;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(86, 94, 239, 0.25);
}

.empty-state button:hover,
.error-state button:hover {
  background: #4549ca;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(86, 94, 239, 0.35);
}

/* Стили состояния ошибки */
.error-state {
  color: #ff5252;
}
.error-state svg {
  stroke: #ff5252;
}
.error-state button {
  background: #ff5252;
}
.error-state button:hover {
  background: #e04545;
}

.desk {
  background: #eaeef6;
  min-height: 100vh;
  padding: 20px;
  transition: background 0.2s;
}

.dark-theme.desk {
  background: #151419;
}
</style>
