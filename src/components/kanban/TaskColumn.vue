<template>
  <div class="main__column column" :class="{ 'dark-theme': isDark }">
    <div class="column__title" :data-status="title">
      <p>{{ title }}</p>
    </div>
    <div class="cards">
      <KanbanTask v-for="task in tasks" :key="task._id" :task="task" @open-task="openTask" />
    </div>
  </div>
</template>

<script setup>
import { inject, defineProps, defineEmits } from 'vue'
import KanbanTask from './KanbanTask.vue'

const isDark = inject('isDark')

const { title, tasks } = defineProps({
  title: String,
  tasks: Array,
})

const emit = defineEmits(['open-task'])

function openTask(task) {
  console.log('TaskColumn emitting open-task for:', task)
  emit('open-task', task)
}
</script>

<style scoped>
.column {
  transition: all 0.3s ease;
}

.column:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.dark-theme.column:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.column__title p {
  color: #000;
}

.dark-theme .column__title p {
  color: #fff;
}
</style>
