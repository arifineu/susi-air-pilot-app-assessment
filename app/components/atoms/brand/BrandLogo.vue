<script setup lang="ts">
/**
 * BrandLogo
 * Renders the real Susi Air brand asset pulled from susiair.com.
 * Served from /public/susi-air-logo.png (240x60 PNG, 4:1 aspect).
 */
interface Props {
  height?: number
  variant?: 'full' | 'mark'
}
withDefaults(defineProps<Props>(), { height: 28, variant: 'full' })
</script>

<template>
  <img
    class="brand-logo"
    :class="`brand-logo--${variant}`"
    src="/susi-air-logo.png"
    :style="{ height: `${height}px` }"
    alt="Susi Air"
    draggable="false"
  />
</template>

<style scoped lang="scss">
.brand-logo {
  display: inline-block;
  width: auto;
  user-select: none;
  aspect-ratio: 4 / 1;
}
</style>
