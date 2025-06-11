<template>
  <header class="header">
    <div class="container">
      <div class="header__block">
        <div class="header__left">
          <!-- Логотип -->
          <div class="header__logo _show _light">
            <a href="" target="_self">
              <img src="@/assets/images/logo.png" alt="Skypro Logo">
            </a>
          </div>
          <div class="header__logo _dark">
            <a href="" target="_self">
              <img src="@/assets/images/logo_dark.png" alt="Skypro Logo">
            </a>
          </div>
        </div>

        <!-- Навигация (справа) -->
        <div class="header__right">
          <nav class="header__nav">
            <button class="header__btn-main-new _hover01" id="btnMainNew">
              <a href="#popNewCard">Создать новую задачу</a>
            </button>
            <div class="user-container" @click.prevent="toggleUserPopup">
              <span class="header__user _hover02">
                Ivan Ivanov
              </span>
            </div>
            <div
              class="header__pop-user-set pop-user-set"
              :style="{ display: showUserPopup ? 'block' : 'none' }"
            >
              <p class="pop-user-set__name">Ivan Ivanov</p>
              <p class="pop-user-set__mail">ivan.ivanov@gmail.com</p>
              <div class="pop-user-set__theme">
                <p>Темная тема</p>
                <input type="checkbox" class="checkbox" name="checkbox">
              </div>
              <button type="button" class="_hover03">
                <a href="#popExit">Выйти</a>
              </button>
            </div>
          </nav>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'BaseHeader',
  setup() {
    const showUserPopup = ref(false);

    const toggleUserPopup = () => {
      showUserPopup.value = !showUserPopup.value;
    };

    return {
      showUserPopup,
      toggleUserPopup
    };
  }
};
</script>

<style scoped>
/* Основные стили для шапки */
.header__block {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

.header__left {
  display: flex;
  align-items: center;
}

.header__right {
  display: flex;
  align-items: center;
}

.header__nav {
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
}

/* Контейнер для имени пользователя */
.user-container {
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
}

/* Стили для текста имени пользователя */
.header__user {
  position: relative;
  display: inline-block;
  padding-right: 15px;
  white-space: nowrap;
  color: #565EEF;
}

.dark-theme .header__user {
  color: #FFFFFF;
}

/* Стрелка */
.header__user::after {
  content: "";
  position: absolute;
  top: 70%;
  right: 0;
  transform: translateY(-50%) rotate(-45deg);
  width: 6px;
  height: 6px;
  border-left: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transition: transform 0.3s ease;
}

/* Анимация стрелки при наведении */
.user-container:hover .header__user::after {
  transform: translateY(-50%) rotate(-225deg);
}

/* Кнопка создания задачи */
.header__btn-main-new {
  white-space: nowrap;
  padding: 8px 15px;
  background: #565EEF;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s;
}

.header__btn-main-new a {
  color: white;
  text-decoration: none;
}

.header__btn-main-new:hover {
  background: #4549ca;
}

/* Стили для попапа пользователя */
.header__pop-user-set {
  position: absolute;
  top: 100%;
  right: 0;
  width: 213px;
  margin-top: 10px;
  padding: 20px;
  border-radius: 10px;
  background: white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.dark-theme .header__pop-user-set {
  background: #20202C;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.pop-user-set__name {
  font-weight: 500;
  margin-bottom: 5px;
  color: #000;
}

.dark-theme .pop-user-set__name {
  color: #FFF;
}

.pop-user-set__mail {
  color: #94A6BE;
  margin-bottom: 15px;
  font-size: 14px;
}

.pop-user-set__theme {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  color: #000;
}

.dark-theme .pop-user-set__theme {
  color: #FFF;
}

._hover03 {
  width: 100%;
  padding: 8px;
  text-align: center;
  border: 1px solid #565EEF;
  border-radius: 4px;
  background: transparent;
  color: #565EEF;
  cursor: pointer;
  transition: all 0.3s;
}

.dark-theme ._hover03 {
  border-color: #FFF;
  color: #FFF;
}

._hover03:hover {
  background: #565EEF;
  color: #FFF;
}

.dark-theme ._hover03:hover {
  background: #7986ff;
}

/* Адаптация для мобильных устройств */
@media (max-width: 768px) {
  .header__nav {
    gap: 10px;
  }

  .header__btn-main-new {
    font-size: 12px;
    padding: 6px 10px;
  }

  .header__user {
    font-size: 13px;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .header__pop-user-set {
    width: 180px;
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .header__btn-main-new {
    font-size: 0;
    padding: 6px;
  }

  .header__btn-main-new::before {
    content: "+";
    font-size: 18px;
    display: inline-block;
  }

  .header__user {
    max-width: 100px;
  }

  .header__pop-user-set {
    width: 160px;
    right: -10px;
  }
}
</style>
