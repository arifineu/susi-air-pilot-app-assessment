<script setup lang="ts">
/**
 * BaseButton
 * Presentational atom. All content via slot. Variants: primary / secondary / ghost / danger.
 * Sizes: sm / md / lg. Optional leading/trailing icon slot. Pill shape on primary/danger.
 */
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  type: 'button',
  fullWidth: false,
})

const emit = defineEmits<{ (e: 'click', payload: MouseEvent): void }>()

function onClick(event: MouseEvent) {
  if (props.disabled || props.loading) return
  emit('click', event)
}
</script>

<template>
  <button
    :type="type"
    class="base-button"
    :class="[
      `base-button--${variant}`,
      `base-button--${size}`,
      { 'base-button--disabled': disabled, 'base-button--loading': loading, 'base-button--full': fullWidth },
    ]"
    :disabled="disabled || loading"
    @click="onClick"
  >
    <span v-if="loading" class="base-button__spinner" aria-hidden="true" />
    <span v-else-if="$slots.icon" class="base-button__icon"><slot name="icon" /></span>
    <span class="base-button__label"><slot /></span>
  </button>
</template>

<style scoped lang="scss">
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  border: 1px solid transparent;
  border-radius: var(--radius-pill);
  font-family: var(--font-sans);
  font-weight: var(--fw-semibold);
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease, transform 0.05s ease;
  white-space: nowrap;
  user-select: none;

  &:active:not(.base-button--disabled):not(.base-button--loading) {
    transform: translateY(0.5px);
  }

  &:focus-visible {
    outline: none;
    box-shadow: var(--shadow-focus);
  }

  &--sm {
    height: var(--control-height-sm);
    padding: 0 var(--space-4);
    font-size: var(--fs-base-sm);
  }

  &--md {
    height: var(--control-height-md);
    padding: 0 var(--space-6);
    font-size: var(--fs-base);
  }

  &--lg {
    height: var(--control-height-lg);
    padding: 0 var(--space-8);
    font-size: var(--fs-md);
  }

  &--primary {
    background: var(--color-red);
    color: #fff;
    &:hover:not(.base-button--disabled):not(.base-button--loading) {
      background: var(--color-red-dark);
    }
  }

  &--secondary {
    background: var(--color-surface);
    color: var(--color-text-primary);
    border-color: var(--color-border);
    &:hover:not(.base-button--disabled):not(.base-button--loading) {
      background: var(--color-surface-alt);
    }
  }

  &--ghost {
    background: transparent;
    color: var(--color-red);
    &:hover:not(.base-button--disabled):not(.base-button--loading) {
      background: rgba(230, 55, 87, 0.08);
    }
  }

  &--danger {
    background: var(--color-danger);
    color: #fff;
    &:hover:not(.base-button--disabled):not(.base-button--loading) {
      background: var(--color-red-dark);
    }
  }

  &--full {
    width: 100%;
  }

  &--disabled,
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  &__spinner {
    width: 14px;
    height: 14px;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: base-button-spin 0.6s linear infinite;
  }
}

@keyframes base-button-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
