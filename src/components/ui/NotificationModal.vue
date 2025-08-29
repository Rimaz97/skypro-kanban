<template>
  <div class="pop-error" @click.self="close">
    <div class="pop-error__container" @click.self="close">
      <div class="pop-error__block">
        <div class="pop-error__ttl">
          <h2>{{ title }}</h2>
        </div>
        <div class="pop-error__message">
          <p>{{ message }}</p>
        </div>
        <div class="pop-error__form-group">
          <button class="pop-error__ok-btn _hover01" @click="close">OK</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import { useRouter } from 'vue-router'



const emit = defineEmits(['close'])
const router = useRouter()

const close = () => {
  emit('close')
  router.push('/')
}
</script>

<style scoped>
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
</style>
