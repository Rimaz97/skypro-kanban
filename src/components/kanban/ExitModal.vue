<template>
  <div class="pop-exit">
    <div class="pop-exit__container">
      <div class="pop-exit__block">
        <div class="pop-exit__ttl">
          <h2>Выйти из аккаунта?</h2>
        </div>
        <div class="pop-exit__form-group">
          <BaseButton type="primary" class="confirm-button" @click="confirmExit">
            Да, выйти
          </BaseButton>
          <BaseButton type="tertiary" class="cancel-button" @click="cancelExit">
            Нет, остаться
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import BaseButton from '@/components/kanban/BaseButton.vue'

export default {
  name: 'ExitModal',
  components: { BaseButton },
  emits: ['confirm-exit', 'cancel-exit'],
  setup(props, { emit }) {
    const router = useRouter()

    const confirmExit = () => {
      localStorage.removeItem('userInfo')
      router.push('/sign-in')
      emit('confirm-exit')
    }

    const cancelExit = () => {
      emit('cancel-exit')
    }

    return {
      confirmExit,
      cancelExit,
    }
  },

}
</script>

<style scoped>
.pop-exit {
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

.pop-exit__container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pop-exit__block {
  background: white;
  border-radius: 10px;
  padding: 30px;
  max-width: 370px;
  width: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  z-index: 300;
}

.dark-theme .pop-exit__block {
  background: #20202c;
}

.pop-exit__ttl h2 {
  text-align: center;
  margin-bottom: 25px;
  font-size: 22px;
}

.pop-exit__form-group {
  display: flex;
  gap: 10px;
}

.confirm-button,
.cancel-button {
  flex: 1;
  height: 45px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 16px;
  transition: all 0.3s ease;
}

.pop-exit__exit-yes {
  background: #565eef;
  color: white;
  border: none;
}

.pop-exit__exit-yes:hover {
  background: #4549ca;
  transform: translateY(-2px);
}

.pop-exit__exit-no {
  background: transparent;
  border: 1px solid #565eef;
  color: #565eef;
}

.pop-exit__exit-no:hover {
  background: #565eef;
  color: white;
  transform: translateY(-2px);
}

.dark-theme .pop-exit__exit-no {
  border-color: #7986ff;
  color: #7986ff;
}

.dark-theme .pop-exit__exit-no:hover {
  background: #7986ff;
}
</style>
