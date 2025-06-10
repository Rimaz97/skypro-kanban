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
