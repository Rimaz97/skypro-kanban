<template>
  <div class="main__block">
    <div class="container">
      <div class="main__content">
        <TaskColumn
          v-for="(column, index) in columns"
          :key="index"
          :title="column.title"
          :tasks="column.tasks"
        />
      </div>
    </div>
  </div>
</template>

<script>
import TaskColumn from './TaskColumn.vue'

export default {
  name: 'TaskDesk',
  components: { TaskColumn },
  data() {
    return {
      columns: [
        {
          title: 'Без статуса',
          tasks: [
            { title: 'Название задачи', category: 'Web Design', date: '30.10.23', theme: '_orange' }
          ]
        },
        {
          title: 'Нужно сделать',
          tasks: [
            { title: 'Название задачи', category: 'Research', date: '30.10.23', theme: '_green' }
          ]
        },
        {
          title: 'В работе',
          tasks: [
            { title: 'Название задачи', category: 'Copywriting', date: '30.10.23', theme: '_purple' }
          ]
        },
        {
          title: 'Тестирование',
          tasks: [
            { title: 'Название задачи', category: 'Research', date: '30.10.23', theme: '_green' }
          ]
        },
        {
          title: 'Готово',
          tasks: [
            { title: 'Название задачи', category: 'Research', date: '30.10.23', theme: '_green' }
          ]
        }
      ]
    }
  }
}
</script>
