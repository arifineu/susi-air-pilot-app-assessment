<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
/* Global page + layout transitions — minimal, polished further in Phase 6. */
.page-enter-active,
.page-leave-active,
.layout-enter-active,
.layout-leave-active {
  transition: opacity 0.15s ease;
}
.page-enter-from,
.page-leave-to,
.layout-enter-from,
.layout-leave-to {
  opacity: 0;
}
</style>
