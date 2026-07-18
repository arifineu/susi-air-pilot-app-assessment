<script setup lang="ts">
/**
 * BottomNavigation
 * Fixed bottom tab bar. Props in (items, activeRoute); events out (navigate).
 * Per brief §5: items are Home · Schedule · Logbook · More (Logbook/More are
 * stubs in this phase — pages wiring happens in Phase 5).
 */
import type { NavItem } from '~/types'

interface Props {
  items: NavItem[]
  activeRoute: string
}
defineProps<Props>()
defineEmits<{ (e: 'navigate', to: string): void }>()
</script>

<template>
  <nav class="bottom-navigation" role="tablist" aria-label="Primary">
    <MoleculesNavigationBottomNavItem
      v-for="item in items"
      :key="item.to"
      :label="item.label"
      :icon="item.icon"
      :badge="item.badge"
      :active="item.to === activeRoute"
      @click="$emit('navigate', item.to)"
    />
  </nav>
</template>

<style scoped lang="scss">
.bottom-navigation {
  display: flex;
  align-items: stretch;
  justify-content: space-around;
  gap: var(--space-1);
  padding: var(--space-2) var(--space-3);
  padding-bottom: max(var(--space-2), env(safe-area-inset-bottom));
  background: var(--color-surface);
  box-shadow: 0 -1px 3px rgba(14, 33, 56, 0.05);
  border-top-left-radius: var(--radius-card);
  border-top-right-radius: var(--radius-card);
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 50;

  margin: 0 auto;
  max-width: 480px;

  @media (min-width: 640px) {
    max-width: 600px;
  }

  @media (min-width: 768px) {
    max-width: 760px;
  }

  @media (min-width: 1024px) {
    max-width: 920px;
  }
}
</style>
