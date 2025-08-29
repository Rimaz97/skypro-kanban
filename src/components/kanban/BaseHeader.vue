<template>
  <header class="header" :class="{ 'dark-theme': isDark }">
    <div class="container">
      <div class="header__block">
        <div class="header__left">
          <div class="header__logo _show _light">
            <router-link to="/">
              <img
                src="@/assets/images/logo.png"
                alt="SkyWords Logo"
                aria-label="Перейти на главную страницу"
              />
            </router-link>
          </div>
          <div class="header__logo _dark">
            <router-link to="/">
              <img
                src="@/assets/images/logo_dark.png"
                alt="SkyWords Logo (dark mode)"
                aria-label="Перейти на главную страницу"
              />
            </router-link>
          </div>
        </div>
        <div class="header__right">
          <nav class="header__nav">
            <button
              class="header__btn-main-new _hover01"
              @click="openNewCard"
              aria-label="Создать новую задачу"
            >
              Создать новую задачу
            </button>
            <div class="user-container" @click.prevent="toggleUserPopup">
              <span class="header__user _hover02"> {{ userName }} </span>
            </div>
            <div class="popup-overlay" v-show="showUserPopup" @click="closePopup"></div>
            <div class="header__pop-user-set pop-user-set" v-show="showUserPopup" @click.stop>
              <p class="pop-user-set__name">{{ userName }}</p>
              <p class="pop-user-set__mail">{{ userEmail }}</p>
              <div class="pop-user-set__theme">
                <p>Темная тема</p>
                <input
                  type="checkbox"
                  class="checkbox"
                  name="checkbox"
                  :checked="isDark"
                  @change="toggleTheme"
                />
              </div>
              <button
                type="button"
                class="_hover03"
                @click="handleExit"
                aria-label="Выйти из системы"
              >
                Выйти
              </button>
            </div>
          </nav>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { inject, ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const auth = inject('auth', { user: ref(null) })
const user = auth.user
const router = useRouter()

const showUserPopup = ref(false)
const isDark = inject('isDark')
const toggleTheme = inject('toggleTheme')

// Имя и email пользователя — computed, чтобы всегда были актуальны
const userName = computed(() => user.value?.user?.name || 'Пользователь')
const userEmail = computed(() => user.value?.user?.login || 'email@example.com')

const toggleUserPopup = () => {
  showUserPopup.value = !showUserPopup.value
}

const closePopup = () => {
  showUserPopup.value = false
}

const handleExit = () => {
  closePopup() // Закрываем попап перед переходом
  router.push('/exit')
}

const openNewCard = () => {
  router.push('/add-task')
}
</script>

<style scoped>
.header {
  background: #fff;
  transition: background 0.2s;
}

.dark-theme.header {
  background: #20202c;
}

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

/* Логотипы */
.header__logo._light {
  display: block;
}

.header__logo._dark {
  display: none;
}

.dark-theme .header__logo._light {
  display: none;
}

.dark-theme .header__logo._dark {
  display: block;
}

.user-container {
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.header__user {
  position: relative;
  display: inline-block;
  padding-right: 15px;
  white-space: nowrap;
  color: #565eef;
}

.dark-theme .header__user {
  color: #fff;
}

.header__user::after {
  content: '';
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

.user-container:hover .header__user::after {
  transform: translateY(-50%) rotate(-225deg);
}

.header__btn-main-new {
  white-space: nowrap;
  padding: 8px 15px;
  background: #565eef;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s;
}

.header__btn-main-new:hover {
  background: #4549ca;
}

/* Оверлей для закрытия попапа */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  z-index: 999;
}

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
  transition: box-shadow 0.2s ease;
}

.dark-theme .header__pop-user-set {
  background: #20202c;
  box-shadow:
    0 4px 20px rgba(255, 255, 255, 0.15),
    0 4px 10px rgba(255, 255, 255, 0.1);
}

.pop-user-set__name {
  font-weight: 500;
  margin-bottom: 5px;
  color: #000;
}

.dark-theme .pop-user-set__name {
  color: #fff;
}

.pop-user-set__mail {
  color: #94a6be;
  margin-bottom: 15px;
  font-size: 14px;
}

.dark-theme .pop-user-set__mail {
  color: #b0b0b0;
}

.pop-user-set__theme {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  color: #000;
}

.dark-theme .pop-user-set__theme {
  color: #fff;
}

._hover03 {
  width: 100%;
  padding: 8px;
  text-align: center;
  border: 1px solid #565eef;
  border-radius: 4px;
  background: transparent;
  color: #565eef;
  cursor: pointer;
  transition: all 0.3s;
}

.dark-theme ._hover03 {
  border-color: #fff;
  color: #fff;
}

._hover03:hover {
  background: #565eef;
  color: #fff;
}

.dark-theme ._hover03:hover {
  background: #7986ff;
}

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
    content: '+';
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
