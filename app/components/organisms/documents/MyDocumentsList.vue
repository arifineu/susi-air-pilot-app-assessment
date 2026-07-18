<script setup lang="ts">
/**
 * MyDocumentsList
 * Header + list of DocumentListItem. Per brief §3.1, the documents' today
 * reference is `mock-documents.json`'s `today` (2026-05-31).
 */
import type { DocumentRecord } from '~/types'

interface Props {
  documents: DocumentRecord[]
  today?: string
  warningDays?: number
  /** Optional section header; defaults to "My Documents". */
  title?: string
}
withDefaults(defineProps<Props>(), {
  today: '2026-05-31',
  warningDays: 30,
  title: 'My Documents',
})
</script>

<template>
  <section class="my-documents-list">
    <header class="my-documents-list__header">
      <h2 class="my-documents-list__title">{{ title }}</h2>
    </header>
    <ul class="my-documents-list__items">
      <MoleculesCardDocumentListItem
        v-for="doc in documents"
        :key="doc.id"
        :label="doc.label"
        :expiry-date="doc.expiryDate"
        :today="today"
        :warning-days="warningDays"
      />
    </ul>
  </section>
</template>

<style scoped lang="scss">
.my-documents-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);

  &__header {
    padding: 0 var(--space-2);
  }

  &__title {
    margin: 0;
    font-size: var(--fs-lg);
    font-weight: var(--fw-bold);
    color: var(--color-text-primary);
  }

  &__items {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
  }
}
</style>
