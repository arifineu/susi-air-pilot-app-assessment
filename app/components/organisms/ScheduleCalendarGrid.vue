<script setup lang="ts">
/**
 * ScheduleCalendarGrid
 * Renders a 6×7 month grid of CalendarDay cells. State flows in via props;
 * month navigation + tap-a-date flow out via events.
 *
 * Drives entirely from `useDutyCalendar` (which itself only reads `schedules`
 * + `legend` + `yearMonth` + `today`). No hardcoded duty codes.
 */
import type { Legend, Schedule } from '~/types'

interface Props {
  schedules: Schedule[]
  legend: Legend[]
  /** 'yyyy-mm' */
  yearMonth: string
  today?: string
}
const props = withDefaults(defineProps<Props>(), { today: '2026-05-31' })

const emit = defineEmits<{
  (e: 'update:yearMonth' | 'select-date', value: string): void
}>()

const grid = useDutyCalendar(
  () => props.schedules,
  () => props.legend,
  () => props.yearMonth,
  () => props.today,
)

const monthLabel = computed(() => {
  const match = /^(\d{4})-(\d{2})$/.exec(props.yearMonth)
  if (!match) return props.yearMonth
  const d = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, 1))
  return d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
})

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Direction-aware slide transition: when prev is tapped, the new month
// enters from the right (older months are conceptually "behind" us).
// `transitionName` flips per nav action and resets after the transition.
const transitionName = ref<'month-next' | 'month-prev'>('month-next')

function shiftMonth(delta: number) {
  const match = /^(\d{4})-(\d{2})$/.exec(props.yearMonth)
  if (!match) return
  transitionName.value = delta < 0 ? 'month-prev' : 'month-next'
  const d = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1 + delta, 1))
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  emit('update:yearMonth', `${y}-${m}`)
}

function cellColor(cell: { schedule?: Schedule }): string | undefined {
  return cell.schedule?.base_color
}

function cellDutyType(cell: { schedule?: Schedule }): string | undefined {
  return cell.schedule?.duty_type
}
</script>

<template>
  <section class="schedule-calendar-grid">
    <header class="schedule-calendar-grid__header">
      <button
        type="button"
        class="schedule-calendar-grid__nav"
        aria-label="Previous month"
        @click="shiftMonth(-1)"
      >
        <Icon name="chevron-left" :size="20" />
      </button>
      <h2 class="schedule-calendar-grid__month">{{ monthLabel }}</h2>
      <button
        type="button"
        class="schedule-calendar-grid__nav"
        aria-label="Next month"
        @click="shiftMonth(1)"
      >
        <Icon name="chevron-right" :size="20" />
      </button>
    </header>

    <div class="schedule-calendar-grid__weekdays">
      <span v-for="day in weekdays" :key="day" class="schedule-calendar-grid__weekday">{{ day }}</span>
    </div>

    <Transition :name="transitionName" mode="out-in">
      <div :key="yearMonth" class="schedule-calendar-grid__cells">
        <template v-for="(row, rIdx) in grid" :key="rIdx">
          <CalendarDay
            v-for="(cell, cIdx) in row"
            :key="cell.date"
            :date="cell.date"
            :day-number="cell.dayNumber"
            :base-color="cellColor(cell)"
            :base-name="cell.schedule?.base_name"
            :duty-type="cellDutyType(cell)"
            :count-schedules="cell.schedule?.count_schedules ?? 0"
            :count-logbooks="cell.schedule?.count_logbooks ?? 0"
            :is-today="cell.isToday"
            :is-out-of-month="cell.isOutOfMonth"
            :data-cy="`cell-${cell.date}-${rIdx}-${cIdx}`"
            @click="$emit('select-date', cell.date)"
          />
        </template>
      </div>
    </Transition>
  </section>
</template>

<style scoped lang="scss">
.schedule-calendar-grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  background: var(--color-surface);
  border-radius: var(--radius-card);
  padding: var(--space-4);
  box-shadow: var(--shadow-sm);

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-3);
  }

  &__month {
    margin: 0;
    font-size: var(--fs-lg);
    font-weight: var(--fw-bold);
    color: var(--color-text-primary);
  }

  &__nav {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background: transparent;
    border: 0;
    border-radius: var(--radius-full);
    color: var(--color-text-secondary);
    cursor: pointer;

    &:hover {
      background: var(--color-surface-alt);
      color: var(--color-text-primary);
    }

    &:active {
      transform: scale(0.92);
    }

    &:focus-visible {
      outline: none;
      box-shadow: var(--shadow-focus);
    }
  }

  &__weekdays {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: var(--space-1);
  }

  &__weekday {
    text-align: center;
    font-size: var(--fs-xs);
    font-weight: var(--fw-bold);
    color: var(--color-text-muted);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    padding: var(--space-1) 0;
  }

  &__cells {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: var(--space-1);
  }
}

// Direction-aware month slide. Prev tap = new (older) month enters from right;
// Next tap = new (newer) month enters from left.
.month-prev-enter-active,
.month-prev-leave-active,
.month-next-enter-active,
.month-next-leave-active {
  transition: transform 0.18s ease, opacity 0.18s ease;
}

.month-prev-enter-from {
  transform: translateX(30px);
  opacity: 0;
}
.month-prev-leave-to {
  transform: translateX(-30px);
  opacity: 0;
}

.month-next-enter-from {
  transform: translateX(-30px);
  opacity: 0;
}
.month-next-leave-to {
  transform: translateX(30px);
  opacity: 0;
}
</style>
