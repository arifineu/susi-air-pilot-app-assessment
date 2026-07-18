<script setup lang="ts">
/**
 * Default layout — wraps every authenticated page with the bottom nav.
 * Active route is derived from `useRoute().path.
 *
 * Responsive: mobile-first column that scales up for tablets. The content
 * column is centered with a sensible max-width at each breakpoint so pilots
 * on tablets aren't forced into a cramped phone-width view.
 */
import { useRoute, useRouter } from 'vue-router'
import type { NavItem } from '~/types'

const route = useRoute()
const router = useRouter()

const activeRoute = computed(() => route.path)

const items: NavItem[] = [
  { label: 'Home', icon: 'home', to: '/home' },
  { label: 'Schedule', icon: 'calendar', to: '/schedule' },
  { label: 'Logbook', icon: 'book', to: '/logbook' },
  { label: 'More', icon: 'more-horizontal', to: '/more' },
]

function onNavigate(to: string) {
  if (to !== route.path) router.push(to)
}
</script>

<template>
  <div class="default-layout">
    <main class="default-layout__main">
      <slot />
    </main>
    <OrganismsNavigationBottomNavigation :items="items" :active-route="activeRoute" @navigate="onNavigate" />
  </div>
</template>

<style scoped lang="scss">
.default-layout {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  background: var(--color-bg);

  &__main {
    flex: 1;
    width: 100%;
    margin: 0 auto 24px auto;
    // Reserve room for the sticky bottom nav so content never hides behind it.
    padding-bottom: calc(var(--space-nav-height, 72px) + env(safe-area-inset-bottom));

    // Phone — comfortable mobile width.
    max-width: 480px;

    // Larger phones / small tablets — give the dashboard room to breathe.
    @media (min-width: 640px) {
      max-width: 600px;
    }

    // Tablets — pilot may use the app on a tablet; don't force phone width.
    @media (min-width: 768px) {
      max-width: 760px;
    }

    // Large tablets / small desktop — keep column centered, not stretched.
    @media (min-width: 1024px) {
      max-width: 920px;
    }
  }
}
</style>
