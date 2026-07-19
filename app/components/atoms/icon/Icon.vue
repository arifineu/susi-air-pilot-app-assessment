<script setup lang="ts">
/**
 * Icon
 * Thin wrapper around @lucide/vue. Defaults to 1.75 stroke width to stay
 * inside the brief's "1.5–2px stroke, line-style only" requirement.
 */
import * as icons from '@lucide/vue'
import type { Component } from 'vue'

interface Props {
  name: string
  size?: number | string
  strokeWidth?: number
  decorative?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  size: 20,
  strokeWidth: 1.75,
  decorative: false,
})

const resolved = computed(() => {
  // lucide exports are PascalCase, e.g. `Plane`, `AlertTriangle`. Allow
  // kebab (`alert-triangle`), snake, and PascalCase from the caller.
  // lucide exports are Vue functional components keyed by PascalCase name
  // (e.g. `Plane`, `AlertTriangle`). Indexing the namespace with a string
  // needs a record type — `Component` keeps it stricter than `any`.
  const table = icons as unknown as Record<string, Component>
  const pascal = props.name
    .split(/[-_]/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('')
  if (table[pascal]) return table[pascal]
  if (table[props.name]) return table[props.name]
  // Case-insensitive fallback (e.g. caller passed "homeicon").
  const key = Object.keys(table).find((k) => k.toLowerCase() === props.name.toLowerCase())
  return key ? table[key] : null
})
</script>

<template>
  <component
    :is="resolved"
    v-if="resolved"
    class="icon"
    :class="{ 'icon--decorative': decorative }"
    :size="size"
    :stroke-width="strokeWidth"
    :aria-hidden="decorative ? 'true' : undefined"
  />
  <span v-else class="icon icon--missing" :aria-label="name">?</span>
</template>

<style scoped lang="scss">
.icon {
  display: inline-block;
  flex-shrink: 0;
  color: currentColor;

  &--missing {
    width: 20px;
    height: 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed var(--color-text-muted);
    border-radius: var(--radius-sm);
    color: var(--color-text-muted);
    font-size: var(--fs-xs);
  }
}
</style>
