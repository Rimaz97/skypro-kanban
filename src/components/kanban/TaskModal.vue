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
              <div class="description-container">
                <p class="description-text">{{ task.description || 'Описание отсутствует' }}</p>
              </div>
            </div>

            <!-- Правая часть: календарь -->
            <div class="date-section">
              <p class="date-label">Даты</p>
              <div class="calendar">
                <div class="calendar-header">
                  <span class="calendar-title">{{ calendarMonth }}</span>
                  <div class="calendar-nav">
                    <button class="nav-button prev" @click="prevMonth">
                      <svg
                        width="10"
                        height="6"
                        viewBox="0 0 10 6"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 5L5 1L1 5"
                          stroke="#94A6BE"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </button>
                    <button class="nav-button next" @click="nextMonth">
                      <svg
                        width="10"
                        height="6"
                        viewBox="0 0 10 6"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 1L5 5L9 1"
                          stroke="#94A6BE"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
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
                      'other-month': !day.isCurrentMonth,
                      selected: day.date === selectedDate,
                      today: day.isToday,
                    }"
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
              <button class="edit-btn" @click="openEditModal">Редактировать задачу</button>
              <button class="delete-btn" @click="deleteTask">Удалить задачу</button>
            </div>
            <button class="close-btn" @click="closeModal">Закрыть</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'TaskModal',
  props: {
    task: {
      type: Object,
      required: true,
    },
    isVisible: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['delete-task', 'close', 'open-edit'],
  setup(props, { emit }) {
    // Форматирование даты
    const formattedDate = computed(() => {
      if (!props.task.date) return 'Не установлен'
      const date = new Date(props.task.date)
      return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    })

    // Цвет категории
    const categoryColor = computed(() => {
      const colors = {
        'Web Design': '#FFE4C2',
        Research: '#B4FDD1',
        Copywriting: '#E9D4FF',
        QA: '#B4FDD1',
        Deployment: '#bae1ff',
        'Bug Fix': '#ffb3ba',
        'UI/UX': '#FFE4C2',
        Backend: '#94A6BE',
      }
      return colors[props.task.topic] || '#eaeef6'
    })

    // Данные для календаря
    const selectedDate = ref(props.task.date || '')
    const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

    // Определяем текущую дату для календаря
    const currentDate = computed(() => {
      return props.task.date ? new Date(props.task.date) : new Date()
    })

    // Название месяца
    const calendarMonth = computed(() => {
      const months = [
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь',
      ]
      return months[currentDate.value.getMonth()]
    })

    // Год
    const calendarYear = computed(() => {
      return currentDate.value.getFullYear()
    })

    // Форматирование выбранной даты
    const formattedSelectedDate = computed(() => {
      if (!selectedDate.value) return 'Не выбрано'
      const date = new Date(selectedDate.value)
      return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    })

    // Генерация дней календаря
    const calendarDays = computed(() => {
      const days = []
      const year = currentDate.value.getFullYear()
      const month = currentDate.value.getMonth()

      // Первый день месяца
      const firstDay = new Date(year, month, 1)
      // Последний день месяца
      const lastDay = new Date(year, month + 1, 0)

      // День недели для первого дня (0 - воскресенье, 1 - понедельник и т.д.)
      let firstDayOfWeek = firstDay.getDay()
      // Корректировка: если воскресенье, то это 0, но нам нужно чтобы было 7
      if (firstDayOfWeek === 0) firstDayOfWeek = 7

      // Пустые ячейки для дней предыдущего месяца
      for (let i = 1; i < firstDayOfWeek; i++) {
        days.push({ day: '', date: null, isCurrentMonth: false, isToday: false })
      }

      // Дни текущего месяца
      for (let day = 1; day <= lastDay.getDate(); day++) {
        const dateString = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const dateObj = new Date(year, month, day)
        dateObj.setHours(0, 0, 0, 0)
        const isToday = dateObj.getTime() === today.getTime()

        days.push({
          date: dateString,
          day: day,
          isCurrentMonth: true,
          isToday: isToday,
        })
      }

      return days
    })

    // Навигация по месяцам
    const prevMonth = () => {
      const newDate = new Date(currentDate.value)
      newDate.setMonth(newDate.getMonth() - 1)
      currentDate.value = newDate
    }

    const nextMonth = () => {
      const newDate = new Date(currentDate.value)
      newDate.setMonth(newDate.getMonth() + 1)
      currentDate.value = newDate
    }

    // Удаление задачи
    const deleteTask = () => {
      if (confirm('Вы точно хотите удалить эту задачу?')) {
        emit('delete-task', props.task.id)
      }
    }

    // Закрытие модалки
    const closeModal = () => {
      emit('close')
    }

    // Открытие окна редактирования
    const openEditModal = () => {
      emit('open-edit', props.task)
    }

    return {
      formattedDate,
      categoryColor,
      selectedDate,
      weekdays,
      calendarMonth,
      calendarYear,
      calendarDays,
      formattedSelectedDate,
      prevMonth,
      nextMonth,
      deleteTask,
      closeModal,
      openEditModal,
    }
  },
}
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
  color: #000; /* Цвет текста остается черным для контраста */
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

.description-container {
  border-radius: 8px;
  background: #eaeef6;
  width: 100%;
  height: 100%;
  display: flex;
  padding: 14px;
}

.dark-theme .description-container {
  background: #151419;
}

.description-text {
  font-size: 14px;
  font-weight: 400;
  line-height: 16px;
  color: #333;
  margin: 0;
  text-align: left;
  align-self: flex-start;
}

.dark-theme .description-text {
  color: #e0e0e0;
}

/* Секция календаря - точные стили как в окне создания */
.calendar {
  width: 182px;
  margin-bottom: 0;
}

.date-label {
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  padding-bottom: 14px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  padding: 0 7px;
}

.calendar-title {
  color: #94a6be;
  font-size: 14px;
  line-height: 25px;
  font-weight: 600;
}

.calendar-nav {
  display: flex;
  gap: 10px;
}

.nav-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

/* Направление стрелок */
.nav-button.prev svg {
  transform: rotate(-90deg);
}

.nav-button.next svg {
  transform: rotate(-90deg);
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin: 7px 0;
  padding: 0 7px;
}

.weekday {
  color: #94a6be;
  font-size: 10px;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.2px;
}

.calendar-days {
  width: 182px;
  height: 126px;
  display: flex;
  flex-wrap: wrap;
}

.day {
  width: 22px;
  height: 22px;
  margin: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #94a6be;
  border-radius: 50%;
  cursor: default;
}

.day.other-month {
  opacity: 0;
}

.day.selected {
  background-color: #94a6be;
  color: white;
}

.day.today {
  font-weight: 700;
}

.selected-date-display {
  margin-top: 14px;
  padding: 0 7px;
  font-size: 10px;
  color: #94a6be;
}

.selected-date-display .date {
  color: #000;
}

.dark-theme .selected-date-display .date {
  color: #fff;
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

.edit-btn,
.delete-btn,
.close-btn {
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

.edit-btn,
.delete-btn {
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
.edit-btn:hover,
.delete-btn:hover {
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
