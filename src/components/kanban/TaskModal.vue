<template>
  <div class="pop-browse" v-if="isVisible">
    <div class="pop-browse__container">
      <div class="pop-browse__block">
        <div class="pop-browse__content">
          <!-- Верхний блок: название и категория -->
          <div class="top-block">
            <h3 class="pop-browse__ttl">{{ task.title }}</h3>
            <div class="category-badge" :style="{ backgroundColor: categoryColor }">
              {{ task.topic }}
            </div>
          </div>

          <!-- Блок статуса -->
          <div class="status-block">
            <p class="status-label">Статус</p>
            <div class="status-value">
              {{ task.status }}
            </div>
          </div>

          <!-- Основной контент: описание и дата -->
          <div class="content-block">
            <!-- Левая часть: описание -->
            <div class="description-section">
              <p class="description-label">Описание задачи</p>
              <p class="description-text">{{ task.description || 'Описание отсутствует' }}</p>
            </div>

            <!-- Правая часть: дата -->
            <div class="date-section">
              <p class="date-label">Даты</p>
              <div class="date-value">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="13"
                  viewBox="0 0 13 13"
                  fill="none"
                >
                  <path
                    d="M10.5625 2.03125H2.4375C1.7644 2.03125 1.21875 2.5769 1.21875 3.25V10.5625C1.21875 11.2356 1.7644 11.7812 2.4375 11.7812H10.5625C11.2356 11.7812 11.7812 11.2356 11.7812 10.5625V3.25C11.7812 2.5769 11.2356 2.03125 10.5625 2.03125Z"
                    stroke="#94A6BE"
                    stroke-width="0.8"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M11.7812 4.875H1.21875M3.25 1.21875V2.03125M9.75 1.21875V2.03125"
                    stroke="#94A6BE"
                    stroke-width="0.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <span>{{ formattedDate }}</span>
              </div>
            </div>
          </div>

          <!-- Блок кнопок -->
          <div class="buttons-block">
            <div class="left-buttons">
              <button class="edit-btn" @click="openEditModal">
                Редактировать задачу
              </button>
              <button class="delete-btn" @click="deleteTask">
                Удалить задачу
              </button>
            </div>
            <button class="close-btn" @click="closeModal">
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
    },
    isVisible: {
      type: Boolean,
      required: true
    }
  },
  emits: ['delete-task', 'close', 'open-edit'],
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
        'Web Design': '#FFE4C2',
        'Research': '#B4FDD1',
        'Copywriting': '#E9D4FF',
        'QA': '#B4FDD1',
        'Deployment': '#bae1ff',
        'Bug Fix': '#ffb3ba',
        'UI/UX': '#FFE4C2',
        'Backend': '#94A6BE'
      };
      return colors[props.task.topic] || '#eaeef6';
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

    // Открытие окна редактирования
    const openEditModal = () => {
      emit('open-edit', props.task);
    };

    return {
      formattedDate,
      categoryColor,
      deleteTask,
      closeModal,
      openEditModal
    };
  }
};
</script>

<style scoped>
/* Основные стили модального окна */
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
  background: rgba(0, 0, 0, 0.4);
}

.pop-browse__block {
  max-width: 630px;
  width: 100%;
  background: white;
  border: 0.7px solid #d4dbe5;
  border-radius: 10px;
  box-sizing: border-box;
  padding: 40px 30px;
  position: relative;
}

.dark-theme .pop-browse__block {
  background: #20202c;
  border-color: #4e5566;
}

/* Верхний блок с заголовком и категорией */
.top-block {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 570px;
  margin-bottom: 18px;
}

.pop-browse__ttl {
  font-size: 20px;
  font-weight: 600;
  line-height: 23px;
  color: #000;
  margin: 0;
}

.dark-theme .pop-browse__ttl {
  color: #fff;
}

.category-badge {
  padding: 5px 14px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 600;
  color: #000;
}

.dark-theme .category-badge {
  color: #000;
}

/* Блок статуса */
.status-block {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  max-width: 570px;
  margin-bottom: 18px;
}

.status-label {
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  color: #000;
  margin: 0;
}

.dark-theme .status-label {
  color: #fff;
}

.status-value {
  background: #94a6be;
  color: white;
  border-radius: 24px;
  width: 136px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 14px;
  font-size: 14px;
  font-weight: 500;
}

/* Блок контента */
.content-block {
  display: flex;
  gap: 21px;
  width: 100%;
  max-width: 570px;
  margin-bottom: 18px;
}

/* Секция описания */
.description-section {
  flex: 1;
  max-width: 370px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.description-label {
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  color: #000;
  margin: 0;
}

.dark-theme .description-label {
  color: #fff;
}

.description-text {
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  margin: 0;
}

.dark-theme .description-text {
  color: #e0e0e0;
}

/* Секция даты */
.date-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 168px;
}

.date-label {
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  color: #000;
  margin: 0;
}

.dark-theme .date-label {
  color: #fff;
}

.date-value {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #333;
  font-size: 14px;
}

.dark-theme .date-value {
  color: #e0e0e0;
}

/* Блок кнопок */
.buttons-block {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 570px;
}

.left-buttons {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 8px;
}

.edit-btn, .delete-btn, .close-btn {
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  line-height: 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.edit-btn, .delete-btn {
  border: 0.7px solid #565eef;
  background: transparent;
  color: #565eef;
  padding: 10px 14px;
}

.dark-theme .edit-btn,
.dark-theme .delete-btn {
  border-color: #7986ff;
  color: #7986ff;
}

.edit-btn {
  max-width: 176px;
}

.delete-btn {
  width: 131px;
}

.close-btn {
  background: #565eef;
  color: white;
  width: 86px;
  padding: 10px 14px;
}

.dark-theme .close-btn {
  background: #7986ff;
}

/* Ховер-эффекты */
.edit-btn:hover, .delete-btn:hover {
  background: #565eef;
  color: white;
}

.dark-theme .edit-btn:hover,
.dark-theme .delete-btn:hover {
  background: #7986ff;
}

.close-btn:hover {
  background: #4549ca;
}

.dark-theme .close-btn:hover {
  background: #5d65d4;
}
</style>
