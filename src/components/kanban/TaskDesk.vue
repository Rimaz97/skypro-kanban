<template>
  <div class="desk" :class="{ 'dark-theme': isDark }">
    <div class="main__block">
      <div class="container">
        <div class="main__content">
          <div v-if="error" class="error-state">
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

          <template v-else>
            <TaskColumn
              title="Без статуса"
              :tasks="listNone"
              :isLoading="isLoadingProp"
              @open-task="openTask"
              @list-changed="handleListChanged"
            />
            <TaskColumn
              title="Нужно сделать"
              :tasks="listTodo"
              :isLoading="isLoadingProp"
              @open-task="openTask"
              @list-changed="handleListChanged"
            />
            <TaskColumn
              title="В работе"
              :tasks="listProgress"
              :isLoading="isLoadingProp"
              @open-task="openTask"
              @list-changed="handleListChanged"
            />
            <TaskColumn
              title="Тестирование"
              :tasks="listTest"
              :isLoading="isLoadingProp"
              @open-task="openTask"
              @list-changed="handleListChanged"
            />
            <TaskColumn
              title="Готово"
              :tasks="listDone"
              :isLoading="isLoadingProp"
              @open-task="openTask"
              @list-changed="handleListChanged"
            />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, watch, computed } from 'vue'
import TaskColumn from './TaskColumn.vue'
import { editWord } from '@/services/api'

const props = defineProps({
  tasks: { type: Array, default: () => [] },
  isLoadingProp: Boolean,
  error: String,
})

const emit = defineEmits(['add-task', 'open-task', 'reload'])

const isDark = inject('isDark')

const auth = inject('auth', null)
const token = computed(() => {
  const userInfo = auth?.user?.value
  return userInfo?.token || localStorage.getItem('token') || ''
})

// Реактивные списки задач по статусам
const listNone = ref([])
const listTodo = ref([])
const listProgress = ref([])
const listTest = ref([])
const listDone = ref([])

const lastSnapshot = ref([])

function initListsFromProps() {
  const tasksArray = Array.isArray(props.tasks) ? props.tasks : []

  // Убраны лишние операторы spread - filter уже возвращает новый массив
  listNone.value = tasksArray.filter((t) => t.status === 'Без статуса')
  listTodo.value = tasksArray.filter((t) => t.status === 'Нужно сделать')
  listProgress.value = tasksArray.filter((t) => t.status === 'В работе')
  listTest.value = tasksArray.filter((t) => t.status === 'Тестирование')
  listDone.value = tasksArray.filter((t) => t.status === 'Готово')

  lastSnapshot.value = snapshotAll()
}

function buildAllTasks() {
  const withOrder = (arr, status) => {
    if (!Array.isArray(arr)) return []
    return arr.map((t, i) => ({ ...t, status, order: i }))
  }

  return [
    ...withOrder(listNone.value, 'Без статуса'),
    ...withOrder(listTodo.value, 'Нужно сделать'),
    ...withOrder(listProgress.value, 'В работе'),
    ...withOrder(listTest.value, 'Тестирование'),
    ...withOrder(listDone.value, 'Готово'),
  ].filter(task => task && task._id)
}

function snapshotAll() {
  const allTasks = buildAllTasks()
  return allTasks.map((t) => ({
    id: t.id ?? t._id,
    status: t.status,
    order: t.order ?? 0,
  }))
}

async function onAnyListChanged() {
  const all = buildAllTasks();
  const prev = lastSnapshot.value;
  const changes = [];

  const mapPrev = new Map(prev.map((t) => [String(t.id), t]));

  for (const t of all) {
    const id = t.id ?? t._id;
    if (id == null) continue;
    const key = String(id);
    const prevItem = mapPrev.get(key);
    if (!prevItem || prevItem.status !== t.status || prevItem.order !== t.order) {
      changes.push({
        id,
        task: t,
        status: t.status,
        order: t.order,
      });
    }
  }

  if (changes.length === 0) return;

  for (const ch of changes) {
    try {
      const updatedTask = {
        ...ch.task,
        status: ch.status,
        order: ch.order,
      };
      await editWord(ch.id, updatedTask, token.value);
    } catch {
      // Ошибка уже обрабатывается в API
    }
  }

  lastSnapshot.value = snapshotAll();
}

// Глубокое наблюдение за изменениями задач
watch(() => [...props.tasks], () => {
  initListsFromProps()
}, { deep: true })

// Наблюдаем за изменениями в списках
watch([listNone, listTodo, listProgress, listTest, listDone], onAnyListChanged, { deep: true })

const openTask = (task) => emit('open-task', task)

function handleListChanged({ evt, status }) {
  if (evt?.added?.element) {
    evt.added.element.status = status
  }
}
</script>

<style scoped>
.error-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 160px;
  text-align: center;
  color: #ff5252;
}
.error-state svg {
  stroke: #ff5252;
}
.error-state button {
  margin-top: 12px;
  padding: 10px 22px;
  background: #ff5252;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
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
