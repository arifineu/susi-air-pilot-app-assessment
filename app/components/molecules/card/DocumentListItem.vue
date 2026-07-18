<script setup lang="ts">
/**
 * DocumentListItem
 * Row showing a document label + expiry date + status badge. Status is derived
 * from useDocumentExpiry (pure function under the hood, easy to test).
 */

interface Props {
  label: string
  expiryDate: string
  today?: string
  warningDays?: number
}
const props = withDefaults(defineProps<Props>(), {
  today: '2026-05-31',
  warningDays: 30,
})

const expiry = computed(() =>
  computeDocumentExpiry({
    expiryDate: props.expiryDate,
    today: props.today,
    warningDays: props.warningDays,
  }),
)

const formattedDate = computed(() => {
  const d = new Date(props.expiryDate)
  if (Number.isNaN(d.getTime())) return props.expiryDate
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
})

const statusLabel = computed(() => {
  const { status, daysRemaining } = expiry.value
  if (status === 'expired') {
    const overdue = Math.abs(daysRemaining)
    return overdue === 0 ? 'Expired' : `${overdue}d overdue`
  }
  if (status === 'soon') return `${daysRemaining}d left`
  return 'Valid'
})
</script>

<template>
  <li class="document-list-item">
    <div class="document-list-item__icon">
      <AtomsIcon name="file-text" :size="18" />
    </div>
    <div class="document-list-item__main">
      <span class="document-list-item__label">{{ label }}</span>
      <span class="document-list-item__date">{{ formattedDate }}</span>
    </div>
    <AtomsDisplayBadge :variant="expiry.status" :label="statusLabel" />
  </li>
</template>

<style scoped lang="scss">
.document-list-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-2);
  border-radius: var(--radius-md);

  &:hover {
    background: var(--color-surface-alt);
  }

  &__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: var(--radius-md);
    background: var(--color-surface-alt);
    color: var(--color-text-secondary);
    flex-shrink: 0;
  }

  &__main {
    flex: 1;
    display: flex;
    flex-direction: column;
    line-height: 1.25;
    min-width: 0;
  }

  &__label {
    font-size: var(--fs-base);
    font-weight: var(--fw-medium);
    color: var(--color-text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__date {
    font-size: var(--fs-sm);
    color: var(--color-text-secondary);
    font-weight: var(--fw-medium);
  }
}
</style>
