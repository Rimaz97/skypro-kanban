<template>
  <div class="pop-new-card" @click.self="closeModal">
    <div class="pop-new-card__container" @click.self="closeModal">
      <div class="pop-new-card__block">
        <div class="pop-new-card__content">
          <h3 class="pop-new-card__ttl">Создание задачи</h3>
          <a class="pop-new-card__close" @click="closeModal">&#10006;</a>

          <div class="pop-new-card__wrap">
            <!-- Левая часть: форма -->
            <div class="form-section">
              <form class="pop-new-card__form">
                <div class="form-new__block">
                  <label class="creation-title">Название задачи</label>
                  <input
                    v-model="taskTitle"
                    type="text"
                    class="form-new__input"
                    placeholder="Введите название"
                    required
                  />

                  <label class="creation-title">Описание задачи</label>
                  <textarea
                    v-model="taskDescription"
                    class="form-new__area"
                    placeholder="Введите описание"
                  ></textarea>

                  <div class="categories">
                    <label class="creation-title">Категория</label>
                    <div class="categories__themes">
                      <div
                        v-for="(category, index) in categories"
                        :key="index"
                        :class="[
                          'categories__theme',
                          { '_active-category': selectedCategory === category },
                        ]"
                        :style="{ backgroundColor: categoryColors[category] }"
                        @click="selectCategory(category)"
                      >
                        <p>{{ category }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <!-- Правая часть: календарь -->
            <div class="calendar-section">
              <div class="calendar">
                <label class="creation-title">Даты</label>

                <!-- Заголовок календаря с навигацией -->
                <div class="calendar-header">
                  <div class="calendar-title">{{ calendarTitle }}</div>
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

                <!-- Дни недели -->
                <div class="weekdays">
                  <div v-for="day in weekdays" :key="day" class="weekday">{{ day }}</div>
                </div>

                <div class="calendar__content">
                  <div class="calendar__cells">
                    <div
                      v-for="(day, index) in calendarDays"
                      :key="index"
                      :class="[
                        'calendar__cell',
                        {
                          _current: day.isToday,
                          '_active-day': day.date === selectedDate,
                          '_other-month': !day.isCurrentMonth
                        },
                      ]"
                      @click="day.isCurrentMonth && selectDate(day.date)"
                    >
                      {{ day.day }}
                    </div>
                  </div>

                  <!-- Отображение выбранной даты -->
                  <div v-if="selectedDate" class="selected-date">
                    <span class="label">Срок исполнения:</span>
                    <span class="date">{{ formattedDateShort }}</span>
                  </div>
                  <div v-else class="select-date-prompt">
                    Выберите срок исполнения.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="button-container">
            <button type="submit" class="form-new__create _hover01" @click="createTask">
              Создать задачу
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="showErrorModal" class="pop-error" @click.self="showErrorModal = false">
  <div class="pop-error__container" @click.self="showErrorModal = false">
    <div class="pop-error__block">
      <div class="pop-error__ttl">
        <h2>{{ errorTitle }}</h2>
      </div>
      <div class="pop-error__message">
        <p>{{ errorMessage }}</p>
      </div>
      <div class="pop-error__form-group">
        <button class="pop-error__ok-btn _hover01" @click="showErrorModal = false">OK</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'NewCardModal',
  emits: ['create-task', 'close'],
  setup(props, { emit }) {

    // Данные формы
    const taskTitle = ref('')
    const taskDescription = ref('')
    const selectedCategory = ref(null)
    const selectedDate = ref(null)

const showErrorModal = ref(false)
const errorTitle = ref('')
const errorMessage = ref('')

const showError = (title, message) => {
  errorTitle.value = title
  errorMessage.value = message
  showErrorModal.value = true
}

    // Категории и цвета
    const categories = ref(['Web Design', 'Research', 'Copywriting', 'QA', 'Deployment'])
    const categoryColors = ref({
      'Web Design': '#FFE4C2',
      Research: '#B4FDD1',
      Copywriting: '#E9D4FF',
      QA: '#B4FDD1',
      Deployment: '#bae1ff',
    })

    // Выбор даты
    const selectDate = (date) => {
      selectedDate.value = date
    }

    // Выбор категории
    const selectCategory = (category) => {
      selectedCategory.value = category
    }

    // Навигация по месяцам
    const currentMonth = ref(new Date().getMonth())
    const currentYear = ref(new Date().getFullYear())

    // Дни недели
    const weekdays = ref(['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'])

    // Заголовок календаря
    const calendarTitle = computed(() => {
      const months = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
      ]
      return months[currentMonth.value]
    })

    // Навигация по месяцам
    const prevMonth = () => {
      if (currentMonth.value === 0) {
        currentMonth.value = 11
        currentYear.value--
      } else {
        currentMonth.value--
      }
    }

    const nextMonth = () => {
      if (currentMonth.value === 11) {
        currentMonth.value = 0
        currentYear.value++
      } else {
        currentMonth.value++
      }
    }

    // Генерация календаря
    const calendarDays = computed(() => {
      const days = []
      const year = currentYear.value
      const month = currentMonth.value

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
        days.push({ day: '', date: null, isToday: false, isCurrentMonth: false })
      }

      // Дни текущего месяца
      for (let day = 1; day <= lastDay.getDate(); day++) {
        // Форматирование даты без смещения часового пояса
        const dateString = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`

        // Определение, является ли день сегодняшним
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const dateForComparison = new Date(year, month, day)
        dateForComparison.setHours(0, 0, 0, 0)
        const isToday = dateForComparison.getTime() === today.getTime()

        days.push({
          date: dateString,
          day: day,
          isToday: isToday,
          isCurrentMonth: true
        })
      }

      return days
    })

    // Формат даты (дд.мм.гг)
    const formattedDateShort = computed(() => {
      if (!selectedDate.value) return ''

      // Разбираем дату из строки формата YYYY-MM-DD
      const [year, month, day] = selectedDate.value.split('-').map(Number)

      // Форматируем без использования Date
      return `${day.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}.${year.toString().slice(-2)}`
    })

    // Создание задачи
    const createTask = () => {
      // Валидация
      if (!taskTitle.value.trim()) {
        showError('Ошибка', 'Название задачи не может быть пустым!')
        return
      }

      if (!selectedCategory.value) {
        showError('Ошибка', 'Выберите категорию задачи!')
        return
      }

      const newTask = {
        topic: selectedCategory.value,
        title: taskTitle.value.trim(),
        description: taskDescription.value,
        date: selectedDate.value,
        status: 'Без статуса',
      }

      emit('create-task', newTask)
      resetForm()
    }

    // Закрытие модалки
    const closeModal = () => {
      emit('close')
    }

    // Сброс формы
    const resetForm = () => {
      taskTitle.value = ''
      taskDescription.value = ''
      selectedCategory.value = null
      selectedDate.value = null
    }

    return {
      taskTitle,
      taskDescription,
      selectedCategory,
      selectedDate,
      categories,
      categoryColors,
      calendarDays,
      formattedDateShort,
      selectCategory,
      selectDate,
      createTask,
      closeModal,
      resetForm,
      weekdays,
      calendarTitle,
      prevMonth,
      nextMonth,
        showErrorModal,
  errorTitle,
  errorMessage,
  showError
    }
  }
}
</script>

<style scoped>
.pop-new-card {
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

.pop-new-card__container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pop-new-card__block {
  background: white;
  border-radius: 12px;
  max-width: 630px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
  z-index: 300;
  padding: 40px 30px 48px;
}

.dark-theme .pop-new-card__block {
  background: #20202c;
}

.pop-new-card__ttl {
  font-size: 24px;
  margin-bottom: 25px;
  color: #333;
}

.dark-theme .pop-new-card__ttl {
  color: #fff;
}

.pop-new-card__close {
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 24px;
  cursor: pointer;
  transition: color 0.3s;
  padding: 10px;
}

.pop-new-card__close:hover {
  color: #ff0000;
}

.pop-new-card__wrap {
  display: flex;
  gap: 21px;
}

.form-section {
  max-width: 370px;
  flex: 1;
}

.calendar-section {
  max-width: 168px;
  flex: 1;
}

/* Стили для формы */
.form-new__input,
.form-new__area {
  width: 100%;
  padding: 12px 15px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.dark-theme .form-new__input,
.dark-theme .form-new__area {
  background: #2d2d3a;
  border-color: #444;
  color: #fff;
}

.form-new__input:focus,
.form-new__area:focus {
  border-color: #565eef;
  outline: none;
}

.form-new__area {
  height: 120px;
  resize: vertical;
}

/* Категории */
.categories__themes {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 14px;
  margin-bottom: 20px;
}

.categories__theme {
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  opacity: 0.6;
}

.categories__theme._active-category {
  opacity: 1;
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.categories__theme p {
  font-weight: 500;
  font-size: 14px;
}

/* === СТИЛИ КАЛЕНДАРЯ === */
.calendar {
  width: 168px;
  margin-bottom: 14px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 14px;
  margin-bottom: 7px;
}

.calendar-title {
  color: #94a6be;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  letter-spacing: 0px;
  text-align: left;
}

.calendar-nav {
  display: flex;
  gap: 10px;
}

.nav-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

.nav-button svg {
  width: 10px;
  height: 6px;
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
  margin-bottom: 5px;
}

.weekday {
  font-size: 10px;
  font-weight: 500;
  color: #94a6be;
}

.calendar__content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.calendar__cells {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0;
  width: 100%;
  margin-bottom: 14px;
}

.calendar__cell {
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  color: #94a6be;
  font-family: 'Roboto', sans-serif;
  font-size: 10px;
  font-weight: 400;
  line-height: 12px;
  letter-spacing: -0.02em;
  text-align: center;
}

.dark-theme .calendar__cell {
  color: #94a6be;
}

.calendar__cell:hover {
  background-color: #f0f0f0;
}

.dark-theme .calendar__cell:hover {
  background-color: #2d2d3a;
}

.calendar__cell._current {
  font-weight: bold;
  background-color: #e6e6ff;
}

.dark-theme .calendar__cell._current {
  background-color: #2a2a4a;
}

.calendar__cell._active-day {
  background-color: #94a6be !important;
  color: white !important;
  font-weight: 400;
}

.calendar__cell._other-month {
  opacity: 0.4;
  cursor: default;
  pointer-events: none;
  background-color: transparent !important;
}

.select-date-prompt {
  color: #94a6be;
  font-family: 'Roboto', sans-serif;
  font-size: 10px;
  font-weight: 400;
  line-height: 12px;
  letter-spacing: 0%;
  text-align: left;
  width: 100%;
  margin-top: 5px;
}

.selected-date {
  font-size: 10px;
  color: #94a6be;
  text-align: left;
  width: 100%;
  margin-top: 5px;
}

.selected-date .date {
  color: #333;
  font-weight: 500;
  margin-left: 4px;
}

.dark-theme .selected-date .date {
  color: #e0e0e0;
}

.creation-title {
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  padding-bottom: 14px;
}

.dark-theme .creation-title {
  color: #fff;
}
/* Кнопка создания */
.button-container {
  display: flex;
  justify-content: flex-end;
}

.form-new__create {
  width: auto;
  height: auto;
  padding: 10px 14px;
  background: #565eef;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.form-new__create:hover {
  background: #4549ca;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(86, 94, 239, 0.3);
}

.pop-error {
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

.pop-error__container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pop-error__block {
  background: white;
  border-radius: 10px;
  padding: 30px;
  max-width: 370px;
  width: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  z-index: 300;
}

.dark-theme .pop-error__block {
  background: #20202c;
}

.pop-error__ttl h2 {
  text-align: center;
  margin-bottom: 15px;
  font-size: 22px;
  color: #000;
}

.dark-theme .pop-error__ttl h2 {
  color: #fff;
}

.pop-error__message {
  margin-bottom: 25px;
  text-align: center;
}

.pop-error__message p {
  color: #000;
  font-size: 16px;
  line-height: 1.4;
}

.dark-theme .pop-error__message p {
  color: #fff;
}

.pop-error__form-group {
  display: flex;
  justify-content: center;
}

.pop-error__ok-btn {
  height: 45px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 16px;
  transition: all 0.3s ease;
  padding: 0 30px;
  background: #565eef;
  color: white;
  border: none;
}

.pop-error__ok-btn:hover {
  background: #4549ca;
  transform: translateY(-2px);
}

/* Адаптация для мобильных */
@media (max-width: 768px) {
  .pop-new-card__block {
    max-width: unset;
    width: unset;
    max-height: unset;
    border-radius: 0;
  }

  .pop-new-card__wrap {
    flex-direction: column;
  }

  .calendar-section {
    order: -1;
    margin-bottom: 20px;
    max-width: 100%;
  }

  .calendar {
    width: 100%;
  }

  .calendar__cell {
    height: 24px;
  }

  .button-container {
    margin-top: 10px;
  }
}
</style>
