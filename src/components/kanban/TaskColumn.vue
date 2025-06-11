<template>
  <div class="main__column column">
    <div class="column__title" :data-status="title">
      <p>{{ title }}</p>
    </div>
    <div class="cards">
      <KanbanTask
        v-for="task in tasks"
        :key="task.id"
        :task="task"
      />
    </div>
  </div>
</template>

<script>
import KanbanTask from './KanbanTask.vue';

export default {
  name: 'TaskColumn',
  components: { KanbanTask },
  props: {
    title: String,
    tasks: Array
  }
};
</script>

<style scoped>
/* Специфичные стили для колонки */
.column {
  transition: all 0.3s ease;
}

.column:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.dark-theme .column:hover {
  background-color: rgba(255, 255, 255, 0.05);
}
</style>
