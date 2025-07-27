<template>
  <header class="header">
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
            <div
              class="header__pop-user-set pop-user-set"
              v-show="showUserPopup"
              @click.stop
            >
              <p class="pop-user-set__name">{{ userName }}</p>
              <p class="pop-user-set__mail">{{ userEmail }}</p>
              <div class="pop-user-set__theme">
                <p>Темная тема</p>
                <input
                  type="checkbox"
                  class="checkbox"
                  name="checkbox"
                  v-model="darkThemeEnabled"
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

<script>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'BaseHeader',
  setup() {
    const router = useRouter();
    const showUserPopup = ref(false);
    const darkThemeEnabled = ref(false);
    const userName = ref('');
    const userEmail = ref('');

    onMounted(() => {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const { name, login } = JSON.parse(userData);
          userName.value = name || 'Пользователь';
          userEmail.value = login || 'email@example.com';
        } catch (e) {
          console.error('Ошибка загрузки данных пользователя:', e);
        }
      }

      darkThemeEnabled.value = localStorage.getItem('darkTheme') === 'true';
      updateTheme();
    });

    const updateTheme = () => {
      if (darkThemeEnabled.value) {
        document.body.classList.add('dark-theme');
        localStorage.setItem('darkTheme', 'true');
      } else {
        document.body.classList.remove('dark-theme');
        localStorage.removeItem('darkTheme');
      }
    };

    const toggleUserPopup = () => {
      showUserPopup.value = !showUserPopup.value;
    };

    const handleExit = () => {
      router.push('/exit');
      showUserPopup.value = false;
    };

    const openNewCard = () => {
      router.push('/add-task');
    };

    watch(darkThemeEnabled, () => {
      updateTheme();
    });

    return {
      showUserPopup,
      darkThemeEnabled,
      userName,
      userEmail,
      toggleUserPopup,
      handleExit,
      openNewCard
    };
  }
};
</script>

<style scoped>
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
  color: #ffff;
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
  background: #20202c;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
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
