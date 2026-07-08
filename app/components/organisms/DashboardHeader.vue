<script setup lang="ts">
/**
 * DashboardHeader
 * Sticky app-bar for the dashboard. Brand logo on the left, optional
 * notification bell in the middle, pilot avatar on the right.
 */

interface Props {
  pilotName?: string
  pilotAvatar?: string
  notificationCount?: number
}
const props = withDefaults(defineProps<Props>(), {
  notificationCount: 0,
})

const initials = computed(() => {
  if (!props.pilotName) return '?'
  const parts = props.pilotName.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : ''
  return (first + last).toUpperCase() || '?'
})

defineEmits<{ (e: 'tap-notifications' | 'tap-avatar'): void }>()
</script>

<template>
  <header class="dashboard-header">
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
    <button type="button" class="dashboard-header__avatar-btn" aria-label="Open profile" @click="$emit('tap-avatar')">
      <Avatar :src="pilotAvatar" :name="pilotName" :initials="initials" size="md" />
    </button>
  </header>
</template>

<style scoped lang="scss">
.dashboard-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 10;

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
}
</style>
