<template>
  <div class="pop-edit" v-if="isVisible">
    <div class="pop-edit__container">
      <div class="pop-edit__block">
        <div class="pop-edit__content">
          <!-- Верхний блок: название и категория -->
          <div class="top-block">
            <h3 class="pop-edit__ttl">{{ task.title }}</h3>
            <div class="category-badge" :style="{ backgroundColor: categoryColor }">
              {{ task.topic }}
            </div>
          </div>

          <!-- Блок статуса -->
          <div class="status-block">
            <p class="status-label">Статус</p>
            <div class="status-options">
              <div
                v-for="status in statuses"
                :key="status"
                class="status-option"
                :class="{ 'active': selectedStatus === status }"
                @click="selectStatus(status)"
              >
                {{ status }}
              </div>
            </div>
          </div>

          <!-- Основной контент: описание и дата -->
          <div class="content-block">
            <!-- Левая часть: описание -->
            <div class="description-section">
              <p class="description-label">Описание задачи</p>
              <textarea
                v-model="editedDescription"
                class="description-textarea"
                placeholder="Введите описание задачи"
              ></textarea>
            </div>

            <!-- Правая часть: дата -->
            <div class="date-section">
              <p class="date-label">Даты</p>
              <div class="calendar">
                <div class="calendar-header">
                  <span class="calendar-title">{{ calendarMonth }}</span>
                  <div class="calendar-nav">
                    <button class="nav-button prev" @click="prevMonth">
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 5L5 1L1 5" stroke="#94A6BE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                    <button class="nav-button next" @click="nextMonth">
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="#94A6BE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="weekdays">
                  <div v-for="day in weekdays" :key="day" class="weekday">{{ day }}</div>
                </div>

                <div class="calendar-days">
                  <div
                    v-for="(day, index) in calendarDays"
                    :key="index"
                    class="day"
                    :class="{
                      'current-month': day.isCurrentMonth,
                      'selected': day.date === selectedDate,
                      'today': day.isToday
                    }"
                    @click="selectDate(day.date)"
                  >
                    {{ day.day }}
                  </div>
                </div>

                <div class="selected-date-display">
                  <span class="label">Срок исполнения:</span>
                  <span class="date">{{ formattedSelectedDate }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Блок кнопок -->
          <div class="buttons-block">
            <div class="left-buttons">
              <button class="save-btn" @click="saveChanges">
                Сохранить
              </button>
              <button class="cancel-btn" @click="cancelChanges">
                Отменить
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
import { ref, computed } from 'vue';

export default {
  name: 'EditTaskModal',
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
  emits: ['save', 'delete-task', 'close'],
  setup(props, { emit }) {
    const editedDescription = ref(props.task.description || '');
    const selectedStatus = ref(props.task.status);
    const selectedDate = ref(props.task.date);

    // Состояния для календаря
    const currentMonth = ref(new Date().getMonth());
    const currentYear = ref(new Date().getFullYear());

    // Все возможные статусы
    const statuses = ref([
      'Без статуса',
      'Нужно сделать',
      'В работе',
      'Тестирование',
      'Готово'
    ]);

    // Дни недели
    const weekdays = ref(['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']);

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

    // Название текущего месяца
    const calendarMonth = computed(() => {
      const months = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
      ];
      return months[currentMonth.value];
    });

    // Форматирование выбранной даты
    const formattedSelectedDate = computed(() => {
      if (!selectedDate.value) return 'Не выбрано';
      const date = new Date(selectedDate.value);
      return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    });

    // Генерация дней календаря
    const calendarDays = computed(() => {
      const days = [];
      const year = currentYear.value;
      const month = currentMonth.value;

      // Первый день месяца
      const firstDay = new Date(year, month, 1);
      // Последний день месяца
      const lastDay = new Date(year, month + 1, 0);

      // День недели для первого дня (0 - воскресенье, 1 - понедельник и т.д.)
      let firstDayOfWeek = firstDay.getDay();
      // Корректировка: если воскресенье, то это 0, но нам нужно чтобы было 7
      if (firstDayOfWeek === 0) firstDayOfWeek = 7;

      // Пустые ячейки для дней предыдущего месяца
      for (let i = 1; i < firstDayOfWeek; i++) {
        days.push({ day: '', date: null, isCurrentMonth: false, isToday: false });
      }

      // Дни текущего месяца
      for (let day = 1; day <= lastDay.getDate(); day++) {
        const dateString = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dateObj = new Date(year, month, day);
        dateObj.setHours(0, 0, 0, 0);
        const isToday = dateObj.getTime() === today.getTime();

        days.push({
          date: dateString,
          day: day,
          isCurrentMonth: true,
          isToday: isToday
        });
      }

      return days;
    });

    // Выбор статуса
    const selectStatus = (status) => {
      selectedStatus.value = status;
    };

    // Выбор даты
    const selectDate = (date) => {
      if (date) {
        selectedDate.value = date;
      }
    };

    // Навигация по месяцам
    const prevMonth = () => {
      if (currentMonth.value === 0) {
        currentMonth.value = 11;
        currentYear.value--;
      } else {
        currentMonth.value--;
      }
    };

    const nextMonth = () => {
      if (currentMonth.value === 11) {
        currentMonth.value = 0;
        currentYear.value++;
      } else {
        currentMonth.value++;
      }
    };

    // Сохранение изменений
    const saveChanges = () => {
      const updatedTask = {
        ...props.task,
        description: editedDescription.value,
        status: selectedStatus.value,
        date: selectedDate.value
      };
      emit('save', updatedTask);
    };

    // Отмена изменений
    const cancelChanges = () => {
      editedDescription.value = props.task.description || '';
      selectedStatus.value = props.task.status;
      selectedDate.value = props.task.date;
      closeModal();
    };

    // Удаление задачи
    const deleteTask = () => {
      emit('delete-task', props.task.id);
    };

    // Закрытие модалки
    const closeModal = () => {
      emit('close');
    };

    return {
      editedDescription,
      selectedStatus,
      selectedDate,
      statuses,
      weekdays,
      categoryColor,
      calendarMonth,
      calendarDays,
      formattedSelectedDate,
      selectStatus,
      selectDate,
      prevMonth,
      nextMonth,
      saveChanges,
      cancelChanges,
      deleteTask,
      closeModal
    };
  }
};
</script>

<style scoped>
/* Основные стили модального окна */
.pop-edit {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 250;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
}

.pop-edit__block {
  max-width: 630px;
  width: 100%;
  background: white;
  border: 0.7px solid #d4dbe5;
  border-radius: 10px;
  box-sizing: border-box;
  padding: 40px 30px;
  position: relative;
}

.dark-theme .pop-edit__block {
  background: #20202c;
  border-color: #4e5566;
}

/* Общие блоки */
.top-block,
.status-block,
.content-block,
.buttons-block {
  max-width: 570px;
  width: 100%;
  margin-bottom: 18px;
}

/* Стили для контент-блока */
.content-block {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 21px;
}

.pop-edit__ttl {
  font-size: 20px;
  font-weight: 600;
  line-height: 23px;
  color: #000;
  margin: 0;
}

.dark-theme .pop-edit__ttl {
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

.status-label {
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  color: #000;
  margin: 0 0 14px 0;
}

.dark-theme .status-label {
  color: #fff;
}

/* Опции статуса */
.status-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.status-option {
  padding: 10px 14px;
  border: 0.7px solid rgba(148, 166, 190, 0.4);
  border-radius: 24px;
  color: #94a6be;
  cursor: pointer;
  transition: all 0.3s;
}

.status-option.active {
  background: #94a6be;
  color: white;
}

.status-option:hover {
  background: #eaeef6;
}

.dark-theme .status-option:hover {
  background: #2d2d3a;
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

.description-textarea {
  width: 100%;
  height: 200px;
  padding: 14px;
  border: 0.7px solid rgba(148, 166, 190, 0.4);
  border-radius: 8px;
  resize: vertical;
  font-size: 14px;
}

.dark-theme .description-textarea {
  background: #151419;
  color: #fff;
  border-color: #4e5566;
}

/* Календарь */
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

.calendar {
  width: 168px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 7px;
}

.calendar-title {
  font-size: 14px;
  font-weight: 600;
  color: #94a6be;
}

.nav-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: 5px;
}

.weekday {
  font-size: 10px;
  font-weight: 500;
  color: #94a6be;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.day {
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  cursor: pointer;
  border-radius: 50%;
  color: #94a6be;
}

.day.current-month {
  color: #333;
}

.dark-theme .day.current-month {
  color: #e0e0e0;
}

.day.today {
  font-weight: bold;
  background-color: #e6e6ff;
}

.dark-theme .day.today {
  background-color: #2a2a4a;
}

.day.selected {
  background-color: #94a6be !important;
  color: white !important;
}

.selected-date-display {
  margin-top: 14px;
  font-size: 10px;
  color: #94a6be;
}

.selected-date-display .date {
  color: #333;
  margin-left: 4px;
}

.dark-theme .selected-date-display .date {
  color: #e0e0e0;
}

/* Блок кнопок */
.buttons-block {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-buttons {
  display: flex;
  gap: 8px;
}

.save-btn, .cancel-btn, .delete-btn, .close-btn {
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
  padding: 10px 14px;
}

.save-btn, .close-btn {
  background: #565eef;
  color: white;
  border: none;
}

.dark-theme .save-btn,
.dark-theme .close-btn {
  background: #7986ff;
}

.cancel-btn, .delete-btn {
  border: 0.7px solid #565eef;
  background: transparent;
  color: #565eef;
}

.dark-theme .cancel-btn,
.dark-theme .delete-btn {
  border-color: #7986ff;
  color: #7986ff;
}

.save-btn {
  width: 99px;
}

.cancel-btn {
  width: 93px;
}

.close-btn {
  width: 86px;
}

/* Ховер-эффекты */
.save-btn:hover, .close-btn:hover {
  background: #4549ca;
}

.dark-theme .save-btn:hover,
.dark-theme .close-btn:hover {
  background: #5d65d4;
}

.cancel-btn:hover, .delete-btn:hover {
  background: #565eef;
  color: white;
}

.dark-theme .cancel-btn:hover,
.dark-theme .delete-btn:hover {
  background: #7986ff;
}
</style>
