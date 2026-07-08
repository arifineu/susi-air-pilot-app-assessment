<script setup lang="ts">
/**
 * DashboardHeader
 * Sticky app-bar for the dashboard. Per brief: brand logo + welcome message
 * with pilot name + total flight hours + avatar + notification bell with
 * optional badge.
 *
 * Avatar click toggles a profile dropdown showing pilot name, ID, and a
 * logout action. Dropdown closes on outside click, Escape, or logout.
 */

interface Props {
  pilotName?: string
  pilotId?: string
  pilotAvatar?: string
  /** Total accumulated flight hours — surfaced as a glanceable stat. */
  totalFlightHours?: number
  notificationCount?: number
}
const props = withDefaults(defineProps<Props>(), {
  notificationCount: 0,
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

// Profile dropdown state.
const dropdownOpen = ref(false)
const headerRef = ref<HTMLElement | null>(null)

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value
  if (dropdownOpen.value) emit('tap-avatar')
}

function closeDropdown() {
  dropdownOpen.value = false
}

function onLogout() {
  closeDropdown()
  emit('logout')
}

function onDocumentClick(event: MouseEvent) {
  if (!dropdownOpen.value) return
  if (!headerRef.value) return
  if (!headerRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && dropdownOpen.value) {
    closeDropdown()
  }
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
        <BrandLogo :height="26" />
      </div>
      <button
        v-if="notificationCount > 0 || $slots['notif-slot']"
        type="button"
        class="dashboard-header__notif"
        :aria-label="`Notifications (${notificationCount} unread)`"
        @click="$emit('tap-notifications')"
      >
        <Icon name="bell" :size="22" />
        <span v-if="notificationCount > 0" class="dashboard-header__notif-badge">{{ notificationCount }}</span>
      </button>

      <!-- Avatar trigger + profile dropdown -->
      <div class="dashboard-header__avatar-wrap">
        <button
          type="button"
          class="dashboard-header__avatar-btn"
          aria-label="Open profile menu"
          :aria-expanded="dropdownOpen"
          aria-haspopup="menu"
          @click="toggleDropdown"
        >
          <Avatar :src="pilotAvatar" :name="pilotName" :initials="initials" size="md" />
        </button>

        <Transition name="dropdown">
          <div
            v-if="dropdownOpen"
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
              <Icon name="log-out" :size="16" />
              <span>Sign out</span>
            </button>
          </div>
        </Transition>
      </div>
    </div>

    <div v-if="pilotName" class="dashboard-header__welcome">
      <p class="dashboard-header__greeting">Welcome back,</p>
      <h1 class="dashboard-header__name">{{ pilotName }}</h1>
      <p v-if="formattedHours" class="dashboard-header__hours">
        <Icon name="clock" :size="14" />
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
