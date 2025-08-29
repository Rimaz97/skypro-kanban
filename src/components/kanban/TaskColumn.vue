<template>
  <div class="main__column column" :class="{ 'dark-theme': isDark }">
    <div class="column__title" :data-status="title">
      <p>{{ title }}</p>
    </div>

    <draggable
      v-if="!isLoading"
      class="cards"
      :list="tasks"
      :item-key="itemKey"
      :group="dragGroup"
      :animation="180"
      :swap-threshold="0.65"
      ghost-class="drag-ghost"
      chosen-class="drag-chosen"
      drag-class="drag-dragging"
      :force-fallback="true"
      @change="onChange"
      @add="onAdd"
      @remove="onRemove"
    >
      <template #item="{ element }">
        <KanbanTask :task="element" @open-task="openTask" />
      </template>

      <!-- Плейсхолдер (виден только при dnd) -->
      <template #placeholder>
        <div class="drop-placeholder" aria-hidden="true"></div>
      </template>
    </draggable>

    <!-- Скелетоны во время загрузки -->
    <div v-else class="cards" ref="cardsRef">
      <div v-for="n in skeletonCount" :key="n" class="skeleton-card">
        <div class="skeleton-line title"></div>
        <div class="skeleton-line short"></div>
        <div class="skeleton-line long"></div>
        <div class="skeleton-footer">
          <div class="skeleton-chip"></div>
          <div class="skeleton-chip small"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, ref, onMounted, onBeforeUnmount, computed } from 'vue'
import KanbanTask from './KanbanTask.vue'
import draggable from 'vuedraggable'

const isDark = inject('isDark')

const props = defineProps({
  title: { type: String, required: true },
  tasks: { type: Array, required: true },
  isLoading: { type: Boolean, default: false },
})

const emit = defineEmits(['open-task', 'list-changed'])

const dragGroup = { name: 'kanban', pull: true, put: true }
const itemKey = (task) => task?.id ?? task?._id

function openTask(task) {
  emit('open-task', task)
}
function onChange(evt) {
  emit('list-changed', { evt, status: props.title })
}
function onAdd(evt) {
  emit('list-changed', { evt, status: props.title })
}
function onRemove(evt) {
  emit('list-changed', { evt, status: props.title })
}

// Динамический skeletonCount по высоте .cards
const cardsRef = ref(null)
const cardsH = ref(0)
let ro

onMounted(() => {
  if (cardsRef.value) {
    const el = cardsRef.value
    cardsH.value = el.clientHeight
    ro = new ResizeObserver(([entry]) => {
      cardsH.value = entry.contentRect.height
    })
    ro.observe(el)
  }
})
onBeforeUnmount(() => ro?.disconnect())

const SKELETON_ITEM_H = 92
const skeletonCount = computed(() => {
  const h = Math.max(160, cardsH.value || 0)
  return Math.max(2, Math.min(10, Math.floor(h / SKELETON_ITEM_H)))
})
</script>

<style scoped>
.column {
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  position: relative;
}

.column:hover {
  border: 1px dashed rgba(148, 166, 190, 1);
  border-radius: 10px;
}

.column__title p {
  color: #000;
}
.dark-theme .column__title p {
  color: #fff;
}

.cards {
  flex: 1;
  min-height: 200px;
  transition:
    background-color 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
  border: 2px dashed transparent; /* по умолчанию невидима */
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.empty-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  color: #94a6be;
  font-size: 12px;
}
.dark-theme .empty-hint {
  color: rgba(255, 255, 255, 0.55);
}

/* skeletons */
@keyframes shimmer {
  0% {
    background-position: -400px 0;
  }
  100% {
    background-position: 400px 0;
  }
}

.skeleton-card {
  background: var(--skeleton-bg, #fff);
  border: 1px solid rgba(148, 166, 190, 0.25);
  border-radius: 10px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.dark-theme .skeleton-card {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.12);
}

.skeleton-line {
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(
    90deg,
    rgba(148, 166, 190, 0.18) 25%,
    rgba(148, 166, 190, 0.28) 37%,
    rgba(148, 166, 190, 0.18) 63%
  );
  background-size: 800px 100%;
  animation: shimmer 1.4s ease-in-out infinite;
}
.dark-theme .skeleton-line {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.08) 25%,
    rgba(255, 255, 255, 0.16) 37%,
    rgba(255, 255, 255, 0.08) 63%
  );
  background-size: 800px 100%;
}

.skeleton-line.title {
  width: 70%;
  height: 14px;
}
.skeleton-line.short {
  width: 45%;
}
.skeleton-line.long {
  width: 90%;
}

.skeleton-footer {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}
.skeleton-chip {
  height: 20px;
  width: 80px;
  border-radius: 10px;
  background: linear-gradient(
    90deg,
    rgba(148, 166, 190, 0.18) 25%,
    rgba(148, 166, 190, 0.28) 37%,
    rgba(148, 166, 190, 0.18) 63%
  );
  background-size: 800px 100%;
  animation: shimmer 1.4s ease-in-out infinite;
}
.dark-theme .skeleton-chip {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.08) 25%,
    rgba(255, 255, 255, 0.16) 37%,
    rgba(255, 255, 255, 0.08) 63%
  );
}
.skeleton-chip.small {
  width: 52px;
}

.drag-ghost {
  opacity: 0.5;
}
.drag-chosen {
  transform: rotate(1deg);
}
.drag-dragging {
  cursor: grabbing;
}

/* Видимый плейсхолдер во время перетаскивания — подсветка только места вставки */
.drop-placeholder {
  height: 130px; /* под размер твоей карточки */
  border-radius: 10px;
  border: 2px dashed #565eef;
  background: rgba(86, 94, 239, 0.08);
  box-shadow: 0 0 0 2px rgba(86, 94, 239, 0.12);
  margin: 4px 0;
}

/* Подсказка для пустой колонки */
.empty-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  color: #94a6be;
  font-size: 12px;
  border: 1px dashed rgba(148, 166, 190, 0.9);
  border-radius: 10px;
  padding: 10px;
}
.dark-theme .empty-hint {
  color: rgba(255, 255, 255, 0.6);
  border-color: rgba(255, 255, 255, 0.35);
}
</style>
