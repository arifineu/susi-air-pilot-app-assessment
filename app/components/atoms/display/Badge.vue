<script setup lang="ts">
/**
 * Badge
 * Pill-shaped status indicator. Variants map to document expiry status
 * (safe/soon/expired) plus a neutral default.
 */
interface Props {
  variant?: 'safe' | 'soon' | 'expired' | 'neutral'
  label?: string
}
withDefaults(defineProps<Props>(), { variant: 'neutral' })
</script>

<template>
  <span class="badge" :class="`badge--${variant}`">
    <span class="badge__dot" />
    <span class="badge__label"><slot>{{ label }}</slot></span>
  </span>
</template>

<style scoped lang="scss">
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: 2px var(--space-2);
  border-radius: var(--radius-full);
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  letter-spacing: 0.02em;
  text-transform: uppercase;
  line-height: 1.4;

  &__dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
  }

  &--safe {
    background: rgba(31, 191, 143, 0.12);
    color: #0e9472;
  }

  &--soon {
    background: rgba(245, 158, 11, 0.14);
    color: #b8730a;
  }

  &--expired {
    background: rgba(230, 55, 87, 0.12);
    color: var(--color-danger);
  }

  &--neutral {
    background: var(--color-surface-alt);
    color: var(--color-text-secondary);
  }
}
</style>
