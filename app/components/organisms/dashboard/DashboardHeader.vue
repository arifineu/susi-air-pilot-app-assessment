<script setup lang="ts">
/**
 * DashboardHeader
 * Sticky app-bar for the dashboard. Per brief: brand logo + welcome message
 * with pilot name + total flight hours + avatar + notification bell.
 *
 * The bell is always visible; its unread badge is hidden when there are
 * no unread notifications. Both the bell and the avatar open their own
 * dropdown panels — opening one closes the other (single activeDropdown).
 * Dropdowns close on outside click, Escape, or option-specific action.
 */
import type { NotificationItem } from '~/types'
import { formatDateLong } from '~/utils/format'

interface Props {
  pilotName?: string
  pilotId?: string
  pilotAvatar?: string
  /** Total accumulated flight hours — surfaced as a glanceable stat. */
  totalFlightHours?: number
  /** Bell dropdown entries. Unread count is derived from `read: false`. */
  notifications?: NotificationItem[]
  /** ISO date for the "today" line above the greeting. Hidden when omitted. */
  today?: string
}
const props = withDefaults(defineProps<Props>(), {
  notifications: () => [],
})

const emit = defineEmits<{
  (e: 'tap-notifications' | 'tap-avatar' | 'logout'): void
}>()

const initials = computed(() => {
  if (!props.pilotName) return '?'
  const parts = props.pilotName.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : ''
  return (first + last).toUpperCase() || '?'
})

// Format 1444.5 → "1,444.5h"; 1444 → "1,444h"; undefined → "".
const formattedHours = computed(() => {
  if (typeof props.totalFlightHours !== 'number') return ''
  const rounded = Math.round(props.totalFlightHours * 10) / 10
  const isWhole = Number.isInteger(rounded)
  const str = isWhole
    ? rounded.toLocaleString('en-US')
    : rounded.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  return `${str}h`
})

// "2026-05-31" → "Sunday, 31 May 2026"; empty when prop omitted.
const formattedToday = computed(() => (props.today ? formatDateLong(props.today) : ''))

const unreadCount = computed(() => props.notifications.filter((n) => !n.read).length)

// Single source of truth for which dropdown (if any) is open. The bell and
// the avatar are mutually exclusive — opening one closes the other.
type DropdownKey = 'profile' | 'notifications'
const activeDropdown = ref<DropdownKey | null>(null)
const headerRef = ref<HTMLElement | null>(null)

function toggleDropdown(which: DropdownKey) {
  activeDropdown.value = activeDropdown.value === which ? null : which
  if (activeDropdown.value === 'profile') emit('tap-avatar')
  else if (activeDropdown.value === 'notifications') emit('tap-notifications')
}

function closeDropdown() {
  activeDropdown.value = null
}

function onLogout() {
  closeDropdown()
  emit('logout')
}

function onDocumentClick(event: MouseEvent) {
  if (activeDropdown.value === null) return
  if (!headerRef.value) return
  if (!headerRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && activeDropdown.value !== null) {
    closeDropdown()
  }
}

// Variant → icon mapping for notification list items.
const ICON_BY_VARIANT: Record<NonNullable<NotificationItem['variant']>, string> = {
  info: 'info',
  success: 'check-circle',
  warning: 'alert-triangle',
  danger: 'alert-octagon',
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <header ref="headerRef" class="dashboard-header">
    <div class="dashboard-header__top">
      <div class="dashboard-header__brand">
        <AtomsBrandLogo :height="26" />
      </div>

      <!-- Bell — always visible. Badge hides when no unread notifications. -->
      <div class="dashboard-header__notif-wrap">
        <button
          type="button"
          class="dashboard-header__notif"
          :aria-label="`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`"
          :aria-expanded="activeDropdown === 'notifications'"
          aria-haspopup="menu"
          @click="toggleDropdown('notifications')"
        >
          <AtomsIcon name="bell" :size="22" />
          <span v-if="unreadCount > 0" class="dashboard-header__notif-badge">{{ unreadCount }}</span>
        </button>

        <Transition name="dropdown">
          <div
            v-if="activeDropdown === 'notifications'"
            class="dashboard-header__dropdown dashboard-header__notif-dropdown"
            role="menu"
            aria-label="Notifications"
          >
            <div class="dashboard-header__dropdown-header dashboard-header__notif-header">
              <p class="dashboard-header__notif-title">Notifications</p>
              <span v-if="unreadCount > 0" class="dashboard-header__notif-count">{{ unreadCount }} new</span>
            </div>
            <div class="dashboard-header__dropdown-divider" />
            <div class="dashboard-header__notif-list">
              <p v-if="notifications.length === 0" class="dashboard-header__notif-empty">
                You're all caught up.
              </p>
              <article
                v-for="item in notifications"
                :key="item.id"
                class="dashboard-header__notif-item"
                :class="{ 'dashboard-header__notif-item--unread': !item.read }"
                role="menuitem"
              >
                <span class="dashboard-header__notif-icon" :class="`dashboard-header__notif-icon--${item.variant ?? 'info'}`">
                  <AtomsIcon :name="ICON_BY_VARIANT[item.variant ?? 'info']" :size="16" />
                </span>
                <div class="dashboard-header__notif-content">
                  <p class="dashboard-header__notif-item-title">{{ item.title }}</p>
                  <p v-if="item.body" class="dashboard-header__notif-item-body">{{ item.body }}</p>
                  <p v-if="item.time" class="dashboard-header__notif-item-time">{{ item.time }}</p>
                </div>
                <span v-if="!item.read" class="dashboard-header__notif-dot" aria-label="Unread" />
              </article>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Avatar trigger + profile dropdown -->
      <div class="dashboard-header__avatar-wrap">
        <button
          type="button"
          class="dashboard-header__avatar-btn"
          aria-label="Open profile menu"
          :aria-expanded="activeDropdown === 'profile'"
          aria-haspopup="menu"
          @click="toggleDropdown('profile')"
        >
          <AtomsBrandAvatar :src="pilotAvatar" :name="pilotName" :initials="initials" size="md" />
        </button>

        <Transition name="dropdown">
          <div
            v-if="activeDropdown === 'profile'"
            class="dashboard-header__dropdown"
            role="menu"
            aria-label="Profile menu"
          >
            <div class="dashboard-header__dropdown-header">
              <p v-if="pilotName" class="dashboard-header__dropdown-name">{{ pilotName }}</p>
              <p v-if="pilotId" class="dashboard-header__dropdown-id">Pilot ID · {{ pilotId }}</p>
            </div>
            <div class="dashboard-header__dropdown-divider" />
            <button type="button" class="dashboard-header__logout" role="menuitem" @click="onLogout">
              <AtomsIcon name="log-out" :size="16" />
              <span>Sign out</span>
            </button>
          </div>
        </Transition>
      </div>
    </div>

    <div v-if="pilotName" class="dashboard-header__welcome">
      <p v-if="formattedToday" class="dashboard-header__date">{{ formattedToday }}</p>
      <p class="dashboard-header__greeting">Welcome back,</p>
      <h1 class="dashboard-header__name">{{ pilotName }}</h1>
      <p v-if="formattedHours" class="dashboard-header__hours">
        <AtomsIcon name="clock" :size="14" />
        <span>{{ formattedHours }} total flight time</span>
      </p>
    </div>
  </header>
</template>

<style scoped lang="scss">
.dashboard-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4) var(--space-4);
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 10;

  &__top {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  &__brand {
    flex: 1;
    display: flex;
    align-items: center;
  }

  &__notif-wrap {
    position: relative;
  }

  &__notif {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: transparent;
    border: 0;
    border-radius: var(--radius-full);
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: background 0.15s ease, color 0.15s ease;

    &:hover {
      background: var(--color-surface-alt);
      color: var(--color-text-primary);
    }
  }

  &__notif-badge {
    position: absolute;
    top: 4px;
    right: 4px;
    min-width: 16px;
    height: 16px;
    padding: 0 4px;
    border-radius: var(--radius-full);
    background: var(--color-red);
    color: #fff;
    font-size: 10px;
    font-weight: var(--fw-bold);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }

  &__avatar-wrap {
    position: relative;
  }

  &__avatar-btn {
    padding: 0;
    background: transparent;
    border: 0;
    cursor: pointer;
    border-radius: 50%;

    &:focus-visible {
      outline: none;
      box-shadow: var(--shadow-focus);
    }
  }

  // Welcome block — pilot identity + glanceable total-hours stat.
  &__welcome {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__greeting {
    margin: 0;
    font-size: var(--fs-base-sm);
    color: var(--color-text-secondary);
  }

  &__date {
    margin: 0 0 2px;
    font-size: var(--fs-xs);
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    font-weight: var(--fw-semibold);
  }

  &__name {
    margin: 0;
    font-size: var(--fs-xl);
    font-weight: var(--fw-bold);
    color: var(--color-text-primary);
    line-height: 1.2;
  }

  &__hours {
    margin: var(--space-1) 0 0;
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
    font-size: var(--fs-sm);
    color: var(--color-text-secondary);

    // Numeric value bold-weighted per brief §5.
    :deep(span) {
      font-weight: var(--fw-bold);
      color: var(--color-text-primary);
    }
  }

  // Profile dropdown.
  &__dropdown {
    position: absolute;
    top: calc(100% + var(--space-2));
    right: 0;
    min-width: 220px;
    background: var(--color-surface);
    border-radius: var(--radius-card);
    box-shadow: var(--shadow-md);
    border: 1px solid var(--color-border);
    overflow: hidden;
    z-index: 20;
  }

  // Notifications dropdown — wider than profile, scrollable list.
  &__notif-dropdown {
    // Width: ideal 320px, bounded to viewport on small screens. `width`
    // (not min-width) is the controlling dimension — we override the
    // inherited `min-width: 220px` from `__dropdown` so CSS doesn't
    // force a too-wide floor on phones.
    width: min(320px, calc(100vw - var(--space-4) * 2));
    min-width: 0;

    // The dropdown is anchored to `.dashboard-header__notif-wrap`, which
    // sits LEFT of the avatar — its right edge is at
    //   viewport_right - header_padding - avatar_width - flex_gap
    // Without a shift, a 320px-wide dropdown extends past the LEFT edge
    // of the viewport on narrow phones (anything < 388px). We shift the
    // right edge by (avatar_width + flex_gap) so it aligns with the
    // avatar's right edge — i.e. the header's right padding — giving the
    // dropdown the full (viewport - 2*padding) of room on its left.
    right: calc(-1 * (40px + var(--space-3)));
  }

  &__notif-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--space-2);
  }

  &__notif-title {
    margin: 0;
    font-size: var(--fs-md);
    font-weight: var(--fw-bold);
    color: var(--color-text-primary);
  }

  &__notif-count {
    font-size: var(--fs-xs);
    color: var(--color-text-secondary);
    font-weight: var(--fw-semibold);
  }

  &__notif-list {
    // Cap by both a fixed max and viewport height — prevents the
    // dropdown from running off the bottom of short / landscape phones.
    max-height: min(360px, 50vh);
    overflow-y: auto;
    // Prevent horizontal scroll on 390px screens.
    overscroll-behavior: contain;
  }

  &__notif-empty {
    margin: 0;
    padding: var(--space-4) var(--space-3);
    text-align: center;
    font-size: var(--fs-base-sm);
    color: var(--color-text-muted);
  }

  &__notif-item {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-3);
    border-bottom: 1px solid var(--color-border);
    transition: background 0.12s ease;

    &:last-child {
      border-bottom: 0;
    }

    &:hover {
      background: var(--color-surface-alt);
    }

    &--unread {
      background: rgba(14, 33, 56, 0.025);
    }
  }

  &__notif-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: var(--radius-full);
    flex-shrink: 0;

    &--info {
      color: var(--color-text-secondary);
      background: var(--color-surface-alt);
    }
    &--success {
      color: var(--color-success);
      background: rgba(16, 137, 62, 0.08);
    }
    &--warning {
      color: var(--color-warning);
      background: rgba(245, 158, 11, 0.08);
    }
    &--danger {
      color: var(--color-red);
      background: rgba(230, 55, 87, 0.08);
    }
  }

  &__notif-content {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  &__notif-item-title {
    margin: 0;
    font-size: var(--fs-base);
    font-weight: var(--fw-semibold);
    color: var(--color-text-primary);
    line-height: 1.3;
  }

  &__notif-item-body {
    margin: 0;
    font-size: var(--fs-base-sm);
    color: var(--color-text-secondary);
    line-height: 1.35;
  }

  &__notif-item-time {
    margin: 2px 0 0;
    font-size: var(--fs-xs);
    color: var(--color-text-muted);
  }

  &__notif-dot {
    width: 8px;
    height: 8px;
    border-radius: var(--radius-full);
    background: var(--color-red);
    margin-top: 6px;
    flex-shrink: 0;
  }

  &__dropdown-header {
    padding: var(--space-3) var(--space-4);
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__dropdown-name {
    margin: 0;
    font-size: var(--fs-md);
    font-weight: var(--fw-bold);
    color: var(--color-text-primary);
  }

  &__dropdown-id {
    margin: 0;
    font-size: var(--fs-base-sm);
    color: var(--color-text-secondary);
  }

  &__dropdown-divider {
    height: 1px;
    background: var(--color-border);
  }

  &__logout {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    width: 100%;
    padding: var(--space-3) var(--space-4);
    background: transparent;
    border: 0;
    color: var(--color-red);
    font-size: var(--fs-base);
    font-weight: var(--fw-semibold);
    cursor: pointer;
    text-align: left;
    transition: background 0.15s ease;

    &:hover {
      background: rgba(230, 55, 87, 0.06);
    }

    &:focus-visible {
      outline: none;
      box-shadow: var(--shadow-focus);
    }
  }
}

// Dropdown fade transition.
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
