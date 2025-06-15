<template>
  <div class="cards__item">
    <div class="cards__card card">
      <div class="card__group">
        <div :class="['card__theme', themeClass]">
          <p>{{ task.topic }}</p>
        </div>
        <a href="#popBrowse" target="_self">
          <div class="card__btn">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </a>
      </div>
      <div class="card__content">
        <a href="" target="_blank">
          <h3 class="card__title">{{ task.title }}</h3>
        </a>
        <div class="card__date">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M10.5625 2.03125H2.4375C1.7644 2.03125 1.21875 2.5769 1.21875 3.25V10.5625C1.21875 11.2356 1.7644 11.7812 2.4375 11.7812H10.5625C11.2356 11.7812 11.7812 11.2356 11.7812 10.5625V3.25C11.7812 2.5769 11.2356 2.03125 10.5625 2.03125Z" stroke="#94A6BE" stroke-width="0.8" stroke-linejoin="round"/>
            <path d="M11.7812 4.875H1.21875M3.25 1.21875V2.03125M9.75 1.21875V2.03125" stroke="#94A6BE" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <p>{{ formattedDate }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'KanbanTask',
  props: {
    task: {
      type: Object,
      required: true
    }
  },
  computed: {
    formattedDate() {
      const date = new Date(this.task.date);
      return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    },
    themeClass() {
      // Объект с соответствием темы
      const themeMap = {
        'Web Design': '_orange',
        'Research': '_green',
        'Copywriting': '_purple',
        'QA': '_green',
        'Deployment': '_blue',
        'Bug Fix': '_red',
        'UI/UX': '_orange',
        'Backend': '_gray'
      };
      return themeMap[this.task.topic] || '_gray';
    }
  }
};
</script>

<style scoped>
/* Специфичные стили для компонента */
.cards__card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.cards__card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
