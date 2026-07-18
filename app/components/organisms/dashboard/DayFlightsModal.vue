<script setup lang="ts">
/**
 * DayFlightsModal
 * Lists every flight leg for a given date, sorted by departure time.
 * Completed legs (status=2) render visually muted so the user can scan
 * what's still ahead vs. what already happened today.
 *
 * Windowed navigation: `days[]` carries a fixed run of days (today + the
 * next N). Three ways to move:
 *   - Prev/Next chevron buttons (keyboard / screen-reader accessible)
 *   - Swipe left = next day, swipe right = prev day (touch-native)
 *   - (Future: dots/chips for non-sequential jumps — not in scope)
 *
 * The index resets to 0 every time the modal opens — the dashboard's "fresh
 * glance" semantics want today to show first on each visit, not wherever the
 * user last browsed.
 *
 * Modal pattern mirrors `app/pages/schedule.vue`'s tap-a-date modal — same
 * backdrop, centered card, × close affordance, and fade transition.
 */
import { formatDuration, formatDateLong } from '~/utils/format'
import type { Flight } from '~/types'

interface DayEntry {
  date: string // ISO yyyy-mm-dd
  flights: Flight[] // pre-sorted by dep time upstream
}

interface Props {
  open: boolean
  days: DayEntry[]
}
const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'close'): void }>()

// Index into props.days — 0 = today (first entry). Resets whenever the modal
// reopens so the user always lands on today.
const currentIndex = ref(0)
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) currentIndex.value = 0
  },
)

const currentEntry = computed<DayEntry | undefined>(() => props.days[currentIndex.value])
const canPrev = computed(() => currentIndex.value > 0)
const canNext = computed(() => currentIndex.value < props.days.length - 1)

// Direction-aware slide transition. `day-next` = newer content enters from
// the right; `day-prev` = older content enters from the left. Mirrors the
// pattern in ScheduleCalendarGrid's month nav.
const transitionName = ref<'day-next' | 'day-prev'>('day-next')

function prev() {
  if (!canPrev.value) return
  transitionName.value = 'day-prev'
  currentIndex.value -= 1
}
function next() {
  if (!canNext.value) return
  transitionName.value = 'day-next'
  currentIndex.value += 1
}

// --- Swipe handling -------------------------------------------------------
// Touch-start coords captured on touchstart; on touchend we compute dx/dy
// and trigger prev/next if the gesture is horizontal-dominant and past a
// minimum travel. The body must remain vertically scrollable, so a mostly-
// vertical swipe is ignored entirely.
const SWIPE_THRESHOLD = 50 // px horizontal travel before we treat it as a nav gesture
const touchStartX = ref<number | null>(null)
const touchStartY = ref<number | null>(null)

function onTouchStart(e: TouchEvent) {
  // Ignore multitouch — only track single-finger gestures so a two-finger
  // scroll doesn't accidentally trigger nav.
  if (e.touches.length !== 1) {
    touchStartX.value = null
    touchStartY.value = null
    return
  }
  touchStartX.value = e.touches[0]!.clientX
  touchStartY.value = e.touches[0]!.clientY
}

function onTouchEnd(e: TouchEvent) {
  if (touchStartX.value === null || touchStartY.value === null) return
  const t = e.changedTouches[0]
  if (!t) {
    touchStartX.value = null
    touchStartY.value = null
    return
  }
  const dx = t.clientX - touchStartX.value
  const dy = t.clientY - touchStartY.value
  touchStartX.value = null
  touchStartY.value = null
  // Require horizontal-dominant motion so vertical scrolling the flight
  // list doesn't trigger day nav.
  if (Math.abs(dx) <= Math.abs(dy)) return
  if (Math.abs(dx) < SWIPE_THRESHOLD) return
  if (dx < 0) next() // swipe left = forward
  else prev() // swipe right = back
}

function statusLabel(status: number): string {
  return status === 2 ? 'Completed' : 'Upcoming'
}
function statusVariant(status: number): 'neutral' | 'safe' {
  return status === 2 ? 'safe' : 'neutral'
}
</script>

<template>
  <Transition name="modal">
    <div v-if="open && currentEntry" class="day-flights-modal__backdrop" @click.self="emit('close')">
      <div
        class="day-flights-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Flights for the day"
        @touchstart.passive="onTouchStart"
        @touchend.passive="onTouchEnd"
      >
        <header class="day-flights-modal__header">
          <button
            type="button"
            class="day-flights-modal__nav"
            :disabled="!canPrev"
            aria-label="Previous day"
            @click="prev"
          >
            <AtomsIcon name="chevron-left" :size="20" />
          </button>
          <h2 class="day-flights-modal__title">{{ formatDateLong(currentEntry.date) }}</h2>
          <button
            type="button"
            class="day-flights-modal__nav"
            :disabled="!canNext"
            aria-label="Next day"
            @click="next"
          >
            <AtomsIcon name="chevron-right" :size="20" />
          </button>
          <button
            type="button"
            class="day-flights-modal__close"
            aria-label="Close"
            @click="emit('close')"
          >
            ×
          </button>
        </header>

        <Transition :name="transitionName" mode="out-in">
          <div :key="currentIndex" class="day-flights-modal__body">
            <p v-if="currentEntry.flights.length === 0" class="day-flights-modal__empty">
              No flights scheduled.
            </p>

            <article
              v-for="flight in currentEntry.flights"
              v-else
              :key="flight.id"
              class="day-flights-modal__flight"
              :class="{ 'day-flights-modal__flight--completed': flight.status === 2 }"
            >
              <div class="day-flights-modal__flight-top">
                <span class="day-flights-modal__flight-number">{{ flight.flight_number }}</span>
                <AtomsDisplayBadge :variant="statusVariant(flight.status)" :label="statusLabel(flight.status)" />
              </div>

              <div class="day-flights-modal__route">
                <div class="day-flights-modal__endpoint">
                  <span class="day-flights-modal__icao">{{ flight.departure.icao }}</span>
                  <span v-if="flight.departure.city" class="day-flights-modal__city">{{ flight.departure.city }}</span>
                  <span class="day-flights-modal__time">{{ flight.departure.time }}</span>
                </div>
                <span class="day-flights-modal__arrow" aria-hidden="true">→</span>
                <div class="day-flights-modal__endpoint day-flights-modal__endpoint--arr">
                  <span class="day-flights-modal__icao">{{ flight.arrival.icao }}</span>
                  <span v-if="flight.arrival.city" class="day-flights-modal__city">{{ flight.arrival.city }}</span>
                  <span class="day-flights-modal__time">{{ flight.arrival.time }}</span>
                </div>
              </div>

              <p class="day-flights-modal__meta">
                <span class="day-flights-modal__meta-value">{{ formatDuration(flight.duration_minutes) }}</span>
                <span aria-hidden="true">·</span>
                <span>{{ flight.aircraft }}</span>
                <span aria-hidden="true">·</span>
                <span>{{ flight.aircraft_registration }}</span>
              </p>
            </article>
          </div>
        </Transition>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.day-flights-modal {
  &__backdrop {
    position: fixed;
    inset: 0;
    background: rgba(14, 33, 56, 0.45);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding: var(--space-3);
    z-index: 100;
  }

  &__modal,
  & {
    width: 100%;
    max-width: 480px;
    max-height: calc(100dvh - var(--space-6));
    background: var(--color-surface);
    border-radius: var(--radius-card);
    box-shadow: var(--shadow-md);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  &__header {
    display: grid;
    // prev | title | next | close — title gets the most space.
    grid-template-columns: 32px 1fr 32px 32px;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-3) var(--space-3) var(--space-4);
    border-bottom: 1px solid var(--color-border);
  }

  &__title {
    margin: 0;
    font-size: var(--fs-base);
    font-weight: var(--fw-bold);
    color: var(--color-text-primary);
    line-height: 1.2;
    text-align: center;
  }

  &__nav {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: transparent;
    border: 0;
    border-radius: var(--radius-full);
    color: var(--color-text-secondary);
    cursor: pointer;

    &:hover:not(:disabled) {
      background: var(--color-surface-alt);
      color: var(--color-text-primary);
    }

    &:focus-visible {
      outline: none;
      box-shadow: var(--shadow-focus);
    }

    &:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }
  }

  &__close {
    background: transparent;
    border: 0;
    width: 32px;
    height: 32px;
    font-size: 24px;
    line-height: 1;
    color: var(--color-text-secondary);
    cursor: pointer;
    border-radius: var(--radius-full);

    &:hover {
      background: var(--color-surface-alt);
      color: var(--color-text-primary);
    }

    &:focus-visible {
      outline: none;
      box-shadow: var(--shadow-focus);
    }
  }

  &__body {
    padding: var(--space-3) var(--space-4) var(--space-4);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  &__empty {
    margin: 0;
    padding: var(--space-4) 0;
    text-align: center;
    color: var(--color-text-muted);
    font-size: var(--fs-base);
  }

  &__flight {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    padding: var(--space-3);
    background: var(--color-surface-alt);
    border-radius: var(--radius-md);
    transition: opacity 0.15s ease;

    &--completed {
      opacity: 0.6;
    }
  }

  &__flight-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-2);
  }

  &__flight-number {
    font-size: var(--fs-base);
    font-weight: var(--fw-bold);
    color: var(--color-text-primary);
    letter-spacing: 0.02em;
  }

  &__route {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  &__endpoint {
    display: flex;
    flex-direction: column;
    line-height: 1.2;

    &--arr {
      text-align: right;
      align-items: flex-end;
    }
  }

  &__icao {
    font-size: var(--fs-md);
    font-weight: var(--fw-bold);
    color: var(--color-text-primary);
  }

  &__city {
    font-size: var(--fs-xs);
    color: var(--color-text-secondary);
  }

  &__time {
    font-size: var(--fs-sm);
    font-weight: var(--fw-semibold);
    color: var(--color-text-primary);
    margin-top: 2px;
  }

  &__arrow {
    color: var(--color-text-muted);
    font-size: var(--fs-base);
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: var(--space-1) var(--space-2);
    margin: 0;
    font-size: var(--fs-sm);
    color: var(--color-text-secondary);
  }

  &__meta-value {
    font-weight: var(--fw-bold);
    color: var(--color-text-primary);
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

// Direction-aware day slide. Next = newer day enters from the right;
// Prev = older day enters from the left. Durations kept short so repeated
// swipes don't pile up.
.day-next-enter-active,
.day-next-leave-active,
.day-prev-enter-active,
.day-prev-leave-active {
  transition: transform 0.18s ease, opacity 0.18s ease;
}
.day-next-enter-from {
  transform: translateX(30px);
  opacity: 0;
}
.day-next-leave-to {
  transform: translateX(-30px);
  opacity: 0;
}
.day-prev-enter-from {
  transform: translateX(-30px);
  opacity: 0;
}
.day-prev-leave-to {
  transform: translateX(30px);
  opacity: 0;
}
</style>
