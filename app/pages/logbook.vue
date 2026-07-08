<script setup lang="ts">
/**
 * Logbook stub — per brief §5: "Logbook/More can be stub routes".
 */
definePageMeta({ layout: 'default' })
</script>

<template>
  <div class="stub-page">
    <h1 class="stub-page__title">Logbook</h1>
    <p class="stub-page__text">Coming soon.</p>
  </div>
</template>

<style scoped lang="scss">
.stub-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  min-height: 60dvh;
  padding: var(--space-8) var(--space-4);
  text-align: center;

  &__title {
    margin: 0;
    font-size: var(--fs-2xl);
    font-weight: var(--fw-bold);
    color: var(--color-text-primary);
  }

  &__text {
    margin: 0;
    color: var(--color-text-secondary);
  }
}
</style>
