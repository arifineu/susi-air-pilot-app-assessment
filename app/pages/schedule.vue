<script setup lang="ts">
/**
 * Schedule page — month-grid calendar + legend. Tap-a-date surfaces a
 * placeholder modal per brief §5 ("Detail page coming soon").
 */
import { useSchedulesStore } from '~/stores/schedules'

definePageMeta({ layout: 'default' })

const schedulesStore = useSchedulesStore()

const loading = useLoadingDelay(400)

// Default yearMonth to the month of schedules.json's `today` (2026-05-15 → '2026-05').
const yearMonth = ref(schedulesStore.today.slice(0, 7))

// Tap-a-date placeholder modal state.
const selectedDate = ref<string | null>(null)
const selectedSchedule = computed(() =>
  selectedDate.value ? schedulesStore.scheduleByDate.get(selectedDate.value) : undefined,
)

function onSelectDate(date: string) {
  selectedDate.value = date
}

function closeModal() {
  selectedDate.value = null
}
</script>

<template>
  <div class="schedule-page">
    <header class="schedule-page__header">
      <h1 class="schedule-page__title">Schedule</h1>
    </header>

    <template v-if="loading">
      <div class="schedule-page__skeleton-grid">
        <Skeleton variant="rect" :height="40" />
        <div class="schedule-page__skeleton-cells">
          <Skeleton v-for="i in 42" :key="i" variant="rect" :height="56" radius="12" />
        </div>
      </div>
    </template>
    <ScheduleCalendarGrid
      v-else
      class="schedule-page__grid"
      :schedules="schedulesStore.schedules"
      :legend="schedulesStore.legend"
      :year-month="yearMonth"
      :today="schedulesStore.today"
      @update:year-month="yearMonth = $event"
      @select-date="onSelectDate"
    />

    <ScheduleLegend
      v-if="!loading"
      class="schedule-page__legend"
      :legend="schedulesStore.legend"
      :columns="2"
    />

    <!-- Tap-a-date placeholder modal -->
    <Transition name="modal">
      <div v-if="selectedDate" class="schedule-page__modal-backdrop" @click.self="closeModal">
        <div class="schedule-page__modal" role="dialog" aria-modal="true">
          <header class="schedule-page__modal-header">
            <h2 class="schedule-page__modal-title">{{ selectedDate }}</h2>
            <button
              type="button"
              class="schedule-page__modal-close"
              aria-label="Close"
              @click="closeModal"
            >
              ×
            </button>
          </header>
          <div class="schedule-page__modal-body">
            <p v-if="selectedSchedule" class="schedule-page__modal-text">
              {{ selectedSchedule.base_name }} · {{ selectedSchedule.duty_type }} ·
              {{ selectedSchedule.count_schedules }} duty/duties planned
            </p>
            <p v-else class="schedule-page__modal-text">No duty scheduled.</p>
            <p class="schedule-page__modal-coming-soon">Detail page coming soon.</p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.schedule-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: 0 var(--space-4) var(--space-4);

  &__header {
    padding: var(--space-3) 0 var(--space-1);
  }

  &__title {
    margin: 0;
    font-size: var(--fs-2xl);
    font-weight: var(--fw-bold);
    color: var(--color-text-primary);
  }

  &__grid,
  &__legend {
    width: 100%;
  }

  &__skeleton-grid {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    background: var(--color-surface);
    border-radius: var(--radius-card);
    padding: var(--space-4);
    box-shadow: var(--shadow-sm);
  }

  &__skeleton-cells {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: var(--space-1);
  }

  // Modal
  &__modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(14, 33, 56, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-4);
    z-index: 100;
  }

  &__modal {
    width: 100%;
    max-width: 360px;
    background: var(--color-surface);
    border-radius: var(--radius-card);
    box-shadow: var(--shadow-md);
    overflow: hidden;
  }

  &__modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-3) var(--space-4);
    border-bottom: 1px solid var(--color-border);
  }

  &__modal-title {
    margin: 0;
    font-size: var(--fs-md);
    font-weight: var(--fw-bold);
    color: var(--color-text-primary);
  }

  &__modal-close {
    background: transparent;
    border: 0;
    font-size: 24px;
    line-height: 1;
    color: var(--color-text-secondary);
    cursor: pointer;

    &:hover {
      color: var(--color-text-primary);
    }
  }

  &__modal-body {
    padding: var(--space-4);
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  &__modal-text {
    margin: 0;
    font-size: var(--fs-base);
    color: var(--color-text-primary);
  }

  &__modal-coming-soon {
    margin: 0;
    font-size: var(--fs-sm);
    color: var(--color-text-secondary);
    font-style: italic;
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.15s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
