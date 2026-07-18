<script setup lang="ts">
/**
 * ScheduleLegend
 * List of color-coded legend entries. Driven entirely from `legend[]`
 * (don't hardcode "DTY"/"TRD" — the JSON is the source of truth, per the
 * data-fidelity note in brief §5).
 */
import type { Legend } from '~/types'

interface Props {
  legend: Legend[]
  /** Optional column count for the wrapping layout. Default 2 (mobile). */
  columns?: number
}
withDefaults(defineProps<Props>(), { columns: 2 })
</script>

<template>
  <ul class="schedule-legend" :style="{ '--cols': columns }">
    <MoleculesScheduleLegendItem
      v-for="entry in legend"
      :key="entry.code"
      :color="entry.color"
      :code="entry.code"
      :label="entry.label"
    />
  </ul>
</template>

<style scoped lang="scss">
.schedule-legend {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(var(--cols, 2), minmax(0, 1fr));
  gap: var(--space-3) var(--space-4);
}
</style>
