<script setup lang="ts">
/**
 * BottomNavItem
 * Single tab item for the bottom navigation bar.
 */

interface Props {
  label: string
  icon: string
  active?: boolean
  badge?: number | string
}
withDefaults(defineProps<Props>(), { active: false })
defineEmits<{ (e: 'click'): void }>()
</script>

<template>
  <button
    type="button"
    class="bottom-nav-item"
    :class="{ 'bottom-nav-item--active': active }"
    :aria-current="active ? 'page' : undefined"
    @click="$emit('click')"
  >
    <span class="bottom-nav-item__icon-wrap">
      <AtomsIcon :name="icon" :size="22" />
      <span v-if="badge !== undefined" class="bottom-nav-item__badge">{{ badge }}</span>
    </span>
    <span class="bottom-nav-item__label">{{ label }}</span>
  </button>
</template>

<style scoped lang="scss">
.bottom-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: var(--space-2) var(--space-3);
  background: transparent;
  border: 0;
  color: var(--color-text-secondary);
  cursor: pointer;
  min-width: 64px;
  flex: 1;
  transition: color 0.15s ease;

  &--active {
    color: var(--color-red);
  }

  &:hover:not(.bottom-nav-item--active) {
    color: var(--color-text-primary);
  }

  &:focus-visible {
    outline: none;
    box-shadow: var(--shadow-focus);
    border-radius: var(--radius-sm);
  }

  &__icon-wrap {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 24px;
  }

  &__label {
    font-size: var(--fs-xs);
    font-weight: var(--fw-medium);
    line-height: 1.2;
  }

  &__badge {
    position: absolute;
    top: -4px;
    right: -8px;
    min-width: 16px;
    height: 16px;
    padding: 0 4px;
    background: var(--color-red);
    color: #fff;
    border-radius: var(--radius-full);
    font-size: 10px;
    font-weight: var(--fw-bold);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }
}
</style>
