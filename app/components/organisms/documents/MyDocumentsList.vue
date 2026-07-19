<script setup lang="ts">
/**
 * MyDocumentsList
 * Header + list of DocumentListItem. Per brief §3.1, the documents' today
 * reference is `mock-documents.json`'s `today` (2026-05-31).
 */
import { computed } from 'vue'
import { computeDocumentExpiry } from '~/composables/useDocumentExpiry'
import type { DocumentRecord } from '~/types'

interface Props {
  documents: DocumentRecord[]
  today?: string
  warningDays?: number
  /** Optional section header; defaults to "My Documents". */
  title?: string
}
const props = withDefaults(defineProps<Props>(), {
  today: '2026-05-31',
  warningDays: 30,
  title: 'My Documents',
})

// Sort by expiry date ascending — soonest / most overdue first. We don't
// mutate the prop; the sorted array is a fresh reference. ISO yyyy-mm-dd
// sorts lexically the same as chronologically.
const sortedDocuments = computed(() =>
  [...props.documents].sort((a, b) => a.expiryDate.localeCompare(b.expiryDate)),
)

// Per-status counts for the header. Same pure-function call DocumentListItem
// does per row; lifted here so the header can surface a summary without each
// row reporting up via emits. Map once so we don't iterate three times.
const statusCounts = computed(() => {
  const counts = { expired: 0, soon: 0, safe: 0 }
  for (const doc of props.documents) {
    const { status } = computeDocumentExpiry({
      expiryDate: doc.expiryDate,
      today: props.today,
      warningDays: props.warningDays,
    })
    counts[status]++
  }
  return counts
})

const expiredCount = computed(() => statusCounts.value.expired)
const soonCount = computed(() => statusCounts.value.soon)
</script>

<template>
  <section class="my-documents-list">
    <header class="my-documents-list__header">
      <h2 class="my-documents-list__title">{{ title }}</h2>
      <div
        v-if="expiredCount > 0 || soonCount > 0"
        class="my-documents-list__attention"
      >
        <span v-if="expiredCount > 0" class="my-documents-list__attention-expired">{{ expiredCount }} expired</span>
        <span
          v-if="expiredCount > 0 && soonCount > 0"
          class="my-documents-list__attention-sep"
          aria-hidden="true"
        > · </span>
        <span v-if="soonCount > 0" class="my-documents-list__attention-soon">{{ soonCount }} expiring soon</span>
      </div>
    </header>
    <ul class="my-documents-list__items">
      <MoleculesCardDocumentListItem
        v-for="doc in sortedDocuments"
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
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--space-3);
    padding: 0 var(--space-2);
  }

  &__title {
    margin: 0;
    font-size: var(--fs-lg);
    font-weight: var(--fw-bold);
    color: var(--color-text-primary);
  }

  &__attention {
    display: inline-flex;
    align-items: baseline;
    font-size: var(--fs-sm);
    font-weight: var(--fw-semibold);
    flex-shrink: 0;
    text-align: right;
  }

  &__attention-expired {
    color: var(--color-danger);
  }

  &__attention-soon {
    color: var(--color-warning);
  }

  &__attention-sep {
    color: var(--color-text-muted);
  }

  &__items {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }
}
</style>
