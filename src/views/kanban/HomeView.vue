<template>
  <div class="wrapper">
    <BaseHeader />
    <main class="main">
      <TaskDesk />
    </main>

    <ExitModal />
    <NewCardModal />
    <TaskModal />
  </div>
</template>

<script>
import BaseHeader from '@/components/kanban/BaseHeader.vue';
import TaskDesk from '@/components/kanban/TaskDesk.vue';
import ExitModal from '@/components/kanban/ExitModal.vue';
import NewCardModal from '@/components/kanban/NewCardModal.vue';
import TaskModal from '@/components/kanban/TaskModal.vue';

export default {
  name: 'HomeView',
  components: {
    BaseHeader,
    TaskDesk,
    ExitModal,
    NewCardModal,
    TaskModal
  }
};
</script>
