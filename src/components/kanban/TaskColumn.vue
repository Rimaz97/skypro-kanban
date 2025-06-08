<template>
  <div class="main__column column">
    <div class="column__title">
      <p>{{ title }}</p>
    </div>
    <div class="cards">
      <KanbanTask
        v-for="(task, index) in tasks"
        :key="index"
        :task="task"
      />
    </div>
  </div>
</template>

<script>
import KanbanTask from './KanbanTask.vue'

export default {
  name: 'TaskColumn',
  components: { KanbanTask },
  props: {
    title: String,
    tasks: Array
  }
}
</script>
