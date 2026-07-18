<script setup lang="ts">
/**
 * FlightHoursTrendChart
 * Renders the rolling-sum line chart with a red dashed limit line.
 *
 * Tree-shaking: only register the chart.js bits we actually use. Importing
 * the full `chart.js/auto` would bundle ~150KB of unused controllers.
 */
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  PointElement,
  LineElement,
  LinearScale,
  CategoryScale,
  Filler,
  type ChartData,
  type ChartOptions,
} from 'chart.js'

ChartJS.register(Title, Tooltip, PointElement, LineElement, LinearScale, CategoryScale, Filler)

interface SeriesPoint {
  date: string
  value: number
}

interface Props {
  series: SeriesPoint[]
  limit: number
  max: number
  unit?: string
  height?: number
}
const props = withDefaults(defineProps<Props>(), { unit: 'h', height: 180 })

const labels = computed(() => props.series.map((p) => shortDate(p.date)))
const dataValues = computed(() => props.series.map((p) => p.value))

const chartData = computed<ChartData<'line'>>(() => ({
  labels: labels.value,
  datasets: [
    {
      label: `Flight hours (${props.unit})`,
      data: dataValues.value,
      borderColor: '#22C5E8',
      backgroundColor: 'rgba(34, 197, 232, 0.12)',
      borderWidth: 2,
      tension: 0.35,
      fill: true,
      pointRadius: 0,
      pointHoverRadius: 4,
      pointHoverBackgroundColor: '#22C5E8',
    },
    {
      // Red dashed horizontal limit line. We draw it as a second dataset
      // with identical y values, which chart.js renders as a flat line.
      label: `Limit (${props.limit}${props.unit})`,
      data: props.series.map(() => props.limit),
      borderColor: '#E63757',
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderDash: [6, 4],
      pointRadius: 0,
      pointHoverRadius: 0,
      fill: false,
      tension: 0,
    },
  ],
}))

const chartOptions = computed<ChartOptions<'line'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 0 },
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => {
          const value = typeof ctx.parsed.y === 'number' ? ctx.parsed.y : 0
          return `${ctx.dataset.label}: ${value.toFixed(1)}${props.unit}`
        },
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: '#6B7280',
        font: { size: 10, family: 'Plus Jakarta Sans' },
        maxRotation: 0,
        autoSkip: true,
        maxTicksLimit: 5,
      },
    },
    y: {
      beginAtZero: true,
      max: props.max,
      grid: { color: 'rgba(14, 33, 56, 0.06)' },
      ticks: {
        color: '#6B7280',
        font: { size: 10, family: 'Plus Jakarta Sans' },
        maxTicksLimit: 5,
      },
    },
  },
}))

function shortDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

// Exposed for test consumers — reading the chart canvas pixels is brittle.
defineExpose({ chartData, chartOptions })
</script>

<template>
  <div class="flight-hours-trend-chart" :style="{ height: `${height}px` }">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<style scoped lang="scss">
.flight-hours-trend-chart {
  width: 100%;
  position: relative;
}
</style>
