<template>
  <div class="pop-browse">
    <div class="pop-browse__container">
      <div class="pop-browse__block">
        <div class="pop-browse__content">
          <div class="pop-browse__top-block">
            <h3 class="pop-browse__ttl">{{ task.title }}</h3>
            <a class="pop-browse__close" @click="closeModal">&#10006;</a>
          </div>

          <div class="pop-browse__wrap">
            <div class="pop-browse__form">
              <div class="form-browse__block">
                <div class="task-info">
                  <div class="task-info__item">
                    <strong>Категория:</strong>
                    <span :style="{ color: categoryColor }">{{ task.topic }}</span>
                  </div>

                  <div class="task-info__item">
                    <strong>Статус:</strong>
                    <span>{{ task.status }}</span>
                  </div>

                  <div class="task-info__item">
                    <strong>Срок исполнения:</strong>
                    <span>{{ formattedDate }}</span>
                  </div>

                  <div class="task-info__item">
                    <strong>Описание:</strong>
                    <p>{{ task.description || 'Описание отсутствует' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="pop-browse__btn-browse">
            <button
              class="btn-delete _hover01"
              @click="deleteTask"
            >
              Удалить задачу
            </button>
            <button
              class="btn-close _hover03"
              @click="closeModal"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'TaskModal',
  props: {
    task: {
      type: Object,
      required: true
    }
  },
  emits: ['delete-task', 'close'],
  setup(props, { emit }) {
    // Форматирование даты
    const formattedDate = computed(() => {
      if (!props.task.date) return 'Не установлен';
      const date = new Date(props.task.date);
      return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    });

    // Цвет категории
    const categoryColor = computed(() => {
      const colors = {
        'Web Design': '#FF6D00',
        'Research': '#06B16E',
        'Copywriting': '#9A48F1',
        'QA': '#06B16E',
        'Deployment': '#00508a'
      };
      return colors[props.task.topic] || '#333';
    });

    // Удаление задачи
    const deleteTask = () => {
      if (confirm('Вы точно хотите удалить эту задачу?')) {
        emit('delete-task', props.task.id);
      }
    };

    // Закрытие модалки
    const closeModal = () => {
      emit('close');
    };

    return {
      formattedDate,
      categoryColor,
      deleteTask,
      closeModal
    };
  }
};
</script>

<style scoped>
.pop-browse {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pop-browse__container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pop-browse__block {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
  z-index: 300;
}

.dark-theme .pop-browse__block {
  background: #20202C;
}

.pop-browse__content {
  position: relative;
  padding: 30px;
}

.pop-browse__ttl {
  font-size: 24px;
  margin-bottom: 25px;
  color: #333;
}

.dark-theme .pop-browse__ttl {
  color: #fff;
}

.pop-browse__close {
  position: absolute;
  top: 25px;
  right: 25px;
  font-size: 24px;
  cursor: pointer;
  transition: color 0.3s;
}

.pop-browse__close:hover {
  color: #ff0000;
}

/* Информация о задаче */
.task-info__item {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.dark-theme .task-info__item {
  border-bottom-color: #333;
}

.task-info__item strong {
  display: block;
  margin-bottom: 5px;
  color: #666;
}

.dark-theme .task-info__item strong {
  color: #aaa;
}

.task-info__item span,
.task-info__item p {
  font-size: 16px;
  color: #333;
}

.dark-theme .task-info__item span,
.dark-theme .task-info__item p {
  color: #fff;
}

.task-info__item p {
  margin-top: 10px;
  line-height: 1.5;
}

/* Кнопки */
.pop-browse__btn-browse {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.btn-delete,
.btn-close {
  flex: 1;
  padding: 14px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-delete {
  background: #ff4d4d;
  color: white;
  border: none;
}

.btn-delete:hover {
  background: #e04545;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 77, 77, 0.3);
}

.btn-close {
  background: transparent;
  border: 1px solid #565EEF;
  color: #565EEF;
}

.btn-close:hover {
  background: #565EEF;
  color: white;
  transform: translateY(-2px);
}

.dark-theme .btn-close {
  border-color: #7986ff;
  color: #7986ff;
}

.dark-theme .btn-close:hover {
  background: #7986ff;
}
</style>
