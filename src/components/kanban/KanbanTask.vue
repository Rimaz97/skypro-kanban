<template>
  <div class="cards__item">
    <div class="cards__card card">
      <div class="card__group">
        <div :class="['card__theme', task.theme]">
          <p :class="task.theme">{{ task.category }}</p>
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            viewBox="0 0 13 13"
            fill="none"
          >
            <!-- SVG из вашего кода -->
          </svg>
          <p>{{ task.date }}</p>
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
      required: true,
    },
  },
}
</script>
