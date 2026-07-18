<script setup lang="ts">
/**
 * Avatar
 * Shows an image when src is provided, otherwise initials derived from name.
 */

interface Props {
  src?: string
  alt?: string
  name?: string
  size?: 'sm' | 'md' | 'lg'
}
const props = withDefaults(defineProps<Props>(), { size: 'md' })

const failed = ref(false)
const showImage = computed(() => !!props.src && !failed.value)
const initials = computed(() => {
  if (!props.name) return '?'
  const parts = props.name.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : ''
  return (first + last).toUpperCase()
})
</script>

<template>
  <span class="avatar" :class="`avatar--${size}`">
    <img
      v-if="showImage"
      :src="src"
      :alt="alt || name || 'avatar'"
      class="avatar__img"
      @error="failed = true"
    />
    <span v-else class="avatar__fallback">{{ initials }}</span>
  </span>
</template>

<style scoped lang="scss">
.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  overflow: hidden;
  background: var(--color-surface-alt);
  color: var(--color-text-secondary);
  font-weight: var(--fw-bold);
  border: 1px solid var(--color-border);
  flex-shrink: 0;

  &--sm {
    width: 28px;
    height: 28px;
    font-size: var(--fs-xs);
  }

  &--md {
    width: 40px;
    height: 40px;
    font-size: var(--fs-base-sm);
  }

  &--lg {
    width: 64px;
    height: 64px;
    font-size: var(--fs-md);
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__fallback {
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }
}
</style>
