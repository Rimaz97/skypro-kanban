<template>
  <div>
    <h1>Просмотр задачи</h1>
    <TaskModal :task="task" :isVisible="true" @close="closeModal" />
  </div>
</template>

<script>
import TaskModal from '@/components/kanban/TaskModal.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'ViewTask',
  components: { TaskModal },
  setup() {
    const router = useRouter()
    const task = ref({
      /* Данные задачи */
    })

    const closeModal = () => {
      router.push('/') // Закрыть модалку, вернувшись на главную
    }

    return { task, closeModal }
  },
}
</script>
