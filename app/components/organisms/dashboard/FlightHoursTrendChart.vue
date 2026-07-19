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
  type ChartDataset,
  type ChartOptions,
  type Plugin,
  type ScriptableContext,
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
  /** ISO date of "today" — when present and found in series, the chart draws
   *  a dashed vertical line at that x to anchor the user in the timeline. */
  today?: string
}
const props = withDefaults(defineProps<Props>(), { unit: 'h', height: 240 })

const labels = computed(() => props.series.map((p) => shortDate(p.date)))
const dataValues = computed(() => props.series.map((p) => p.value))

// Index of today in the series. useRollingSum produces a ±7-day window so
// today normally sits at the middle (index 7 of 15), but we look it up by
// date rather than hardcoding so the chart degrades gracefully if the
// upstream window shape ever changes.
const todayIndex = computed(() =>
  props.today ? props.series.findIndex((p) => p.date === props.today) : -1,
)

// Per-segment + per-dot over-limit coloring: only the dots and line segments
// that actually cross the limit render red. chart.js scriptable options are
// functions that receive a context with `parsed.y` (point value) or `p0`/`p1`
// (segment endpoints).
const ACCENT = '#22C5E8'
const ACCENT_FILL = 'rgba(34, 197, 232, 0.12)'
const DANGER = '#E63757'
const DANGER_FILL = 'rgba(230, 55, 87, 0.18)'

const colorForPoint = (value: number | null | undefined) =>
  typeof value === 'number' && value > props.limit ? DANGER : ACCENT
// Segment is red only when BOTH endpoints are over the limit — so a
// transition segment between an under-limit dot (blue) and an over-limit
// dot (red) stays blue, matching the dot coloring. The line "becomes red"
// visually once it's fully in the over-limit zone, not the moment it
// touches it.
const colorForSegment = (
  y0: number | null | undefined,
  y1: number | null | undefined,
) => (colorForPoint(y0) === DANGER && colorForPoint(y1) === DANGER ? DANGER : ACCENT)

/**
 * Custom fill plugin: walks each line segment, fills the area between the
 * segment's curve and the x-axis with ACCENT_FILL (under-limit) or
 * DANGER_FILL (over-limit). chart.js's built-in `fill.target: { value }`
 * only fills the band between the line and the target line — to get a
 * full-area-under-curve fill split per-column at the limit, we draw it
 * ourselves via the canvas API. Runs beforeDatasetDraw so the fill sits
 * behind the line + dots.
 *
 * IMPORTANT: the limit + palette are read from the dataset at draw time
 * (via custom `_segmentFill*` properties below), NOT from a closure.
 * vue-chartjs only re-renders when `data`/`options` change; the `plugins`
 * prop is set once at construction. A closure would freeze the initial
 * limit value and the plugin would keep using stale thresholds when the
 * range toggle swaps limits (1w=40 → 1m=100 → …).
 */
interface SegmentFillMeta {
  _segmentFillLimit: number
  _segmentFillAccent: string
  _segmentFillDanger: string
}

const segmentFillPlugin: Plugin<'line'> = {
  id: 'segmentFill',
  beforeDatasetDraw(chart, args) {
    // Only draw for the main dataset (index 0). Skip the limit-line dataset.
    if (args.index !== 0) return
    const ds = chart.data.datasets[0] as (Partial<ChartDataset<'line'>> & SegmentFillMeta) | undefined
    if (!ds) return
    const { _segmentFillLimit: limit, _segmentFillAccent: accentFill, _segmentFillDanger: dangerFill } = ds
    if (typeof limit !== 'number' || !accentFill || !dangerFill) return

    const meta = chart.getDatasetMeta(0)
    const points = meta?.data as Array<{
      x: number
      y: number
      parsed?: { y: unknown }
      controlPointPrevious?: { x: number; y: number }
      controlPointNext?: { x: number; y: number }
    }>
    if (!points || points.length < 2) return
    const { ctx, chartArea } = chart
    if (!ctx || !chartArea) return

    ctx.save()
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i]!
      const p1 = points[i + 1]!
      const v0 = p0.parsed?.y
      const v1 = p1.parsed?.y
      if (typeof v0 !== 'number' || typeof v1 !== 'number') continue
      const isOver = v0 > limit && v1 > limit // both endpoints over → red
      ctx.fillStyle = isOver ? dangerFill : accentFill
      ctx.beginPath()
      ctx.moveTo(p0.x, p0.y)
      // Use chart.js's precomputed bezier control points when present so
      // the fill edge exactly traces the curved line (tension: 0.35).
      const cp0 = p0.controlPointNext
      const cp1 = p1.controlPointPrevious
      if (cp0 && cp1) {
        ctx.bezierCurveTo(cp0.x, cp0.y, cp1.x, cp1.y, p1.x, p1.y)
      } else {
        ctx.lineTo(p1.x, p1.y)
      }
      ctx.lineTo(p1.x, chartArea.bottom)
      ctx.lineTo(p0.x, chartArea.bottom)
      ctx.closePath()
      ctx.fill()
    }
    ctx.restore()
  },
}

const chartPlugins = [segmentFillPlugin]

/**
 * Today-line plugin: draws a dashed vertical line at the x of the series
 * point whose date matches the `today` prop. Same metadata-on-dataset
 * pattern as segmentFill (vue-chartjs ignores `plugins` prop changes after
 * mount, so the index is read fresh on every draw).
 *
 * Color: text-muted gray — recedes behind the data line + the red limit
 * line. "Today" is an orientation anchor, not an alarm; it shouldn't
 * compete visually with the limit (red) or the data (accent/danger).
 */
const todayLinePlugin: Plugin<'line'> = {
  id: 'todayLine',
  afterDatasetsDraw(chart) {
    const ds = chart.data.datasets[0] as
      | (Partial<ChartDataset<'line'>> & { _todayIndex?: number })
      | undefined
    const idx = ds?._todayIndex
    if (typeof idx !== 'number' || idx < 0) return
    const meta = chart.getDatasetMeta(0)
    const point = meta?.data?.[idx]
    if (!point) return
    const { ctx, chartArea } = chart
    if (!ctx || !chartArea) return

    ctx.save()
    ctx.strokeStyle = '#9ca3af' // gray / --color-text-muted
    ctx.lineWidth = 1.25
    ctx.setLineDash([4, 4])
    ctx.beginPath()
    ctx.moveTo(point.x, chartArea.top)
    ctx.lineTo(point.x, chartArea.bottom)
    ctx.stroke()
    ctx.restore()
  },
}
chartPlugins.push(todayLinePlugin)

/**
 * Today-label plugin: draws the "Today" caption directly below the x-axis
 * at today's x position. We bypass chart.js's tick system because autoSkip
 * runs BEFORE generateTickLabels — if today's tick gets thinned out by
 * maxTicksLimit, no callback or afterTickToLabelConversion hook can bring
 * it back. Drawing on the canvas ourselves sidesteps that entirely.
 *
 * A surface-colored rect behind the text masks any autoSkip-surviving tick
 * label at the same x (e.g. "31 May"), so they don't visually collide.
 */
const todayLabelPlugin: Plugin<'line'> = {
  id: 'todayLabel',
  afterDraw(chart) {
    const ds = chart.data.datasets[0] as
      | (Partial<ChartDataset<'line'>> & { _todayIndex?: number })
      | undefined
    const idx = ds?._todayIndex
    if (typeof idx !== 'number' || idx < 0) return
    const meta = chart.getDatasetMeta(0)
    const point = meta?.data?.[idx]
    if (!point) return
    const { ctx, chartArea } = chart
    if (!ctx || !chartArea) return

    const text = 'Today'
    const x = point.x
    // Sit above the chart area — chartArea.top is the top edge of the plot
    // box; the caption hangs from there into the top padding where chart.js
    // would normally put titles/legends (we use neither).
    const y = chartArea.top - 6

    ctx.save()
    ctx.font = '700 11px "Plus Jakarta Sans", system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'bottom'

    // Mask any background pixels at this x so the caption doesn't collide
    // with chart elements bleeding into the top padding.
    const metrics = ctx.measureText(text)
    const padX = 6
    const padY = 2
    const w = metrics.width + padX * 2
    const h = 14
    ctx.fillStyle = '#ffffff' // matches --color-surface
    ctx.fillRect(x - w / 2, y - h, w, h + padY)

    // Draw the caption — text-secondary gray so it reads as an orientation
    // cue, not an alarm (matches the muted dashed line color).
    ctx.fillStyle = '#6b7280'
    ctx.fillText(text, x, y)

    ctx.restore()
  },
}
chartPlugins.push(todayLabelPlugin)

/**
 * Chips plugin: two pill-shaped overlays.
 *
 * 1. Top-right "Xh limit" chip — always renders; identifies what the red
 *    dashed line means (acts as a legend entry). Red tint matches the limit
 *    line color so the visual association is immediate.
 *
 * 2. Over-limit point chip — renders above the PEAK over-limit data point
 *    with "{value}h {date}". Only the peak (not every over-limit point) so
 *    a sustained multi-day excursion doesn't pile up overlapping chips.
 *    The peak is the most informative: "worst case, on this day".
 */
const RED = '#E63757'
const RED_TINT = 'rgba(230, 55, 87, 0.10)'

function drawChip(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  cy: number,
  color: string,
  bg: string,
) {
  ctx.save()
  ctx.font = '600 11px "Plus Jakarta Sans", system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  const metrics = ctx.measureText(text)
  const padX = 8
  const h = 18
  const w = metrics.width + padX * 2
  const r = h / 2 // fully rounded pill

  ctx.beginPath()
  // roundRect is supported in all evergreen browsers (Chrome 99+, FF 112+,
  // Safari 16+). Hand-rolling a path would be 8 lines of bezier cruft.
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(cx - w / 2, cy - h / 2, w, h, r)
  } else {
    // Fallback: plain rect. Visual delta is just the corner radius.
    ctx.rect(cx - w / 2, cy - h / 2, w, h)
  }
  ctx.fillStyle = bg
  ctx.fill()

  ctx.fillStyle = color
  ctx.fillText(text, cx, cy)
  ctx.restore()
}

const chipsPlugin: Plugin<'line'> = {
  id: 'chartChips',
  afterDraw(chart) {
    const ds = chart.data.datasets[0] as
      | (Partial<ChartDataset<'line'>> & {
          _segmentFillLimit?: number
          _pointLabels?: string[]
        })
      | undefined
    const limit = ds?._segmentFillLimit
    const labels = ds?._pointLabels
    if (typeof limit !== 'number' || !labels) return
    const { ctx, chartArea } = chart
    if (!ctx || !chartArea) return

    // 1. Limit chip — anchored to the right end of the limit line so it acts
    // as a label for that line. chart.scales.y.getPixelForValue(limit) maps
    // the limit's data value to a pixel y, so the chip sits exactly on the
    // line regardless of where the line falls in the plot area (high limit
    // → near top, low limit → near bottom — the chip follows either way).
    const yScale = chart.scales.y
    const limitY =
      yScale && typeof yScale.getPixelForValue === 'function'
        ? yScale.getPixelForValue(limit)
        : chartArea.top
    const margin = 8
    const limitText = `${limit}h limit`
    ctx.font = '600 11px "Plus Jakarta Sans", system-ui, sans-serif'
    const limitW = ctx.measureText(limitText).width + 16
    drawChip(
      ctx,
      limitText,
      chartArea.right - limitW / 2 - margin,
      limitY - 12, // sit just above the limit line, not on it
      RED,
      RED_TINT,
    )

    // 2. Over-limit peak chip. Walk all points, track the max-value one whose
    // value > limit. Render a chip above it with "{value}h {date}".
    const meta = chart.getDatasetMeta(0)
    const points = (meta?.data ?? []) as Array<{
      x: number
      y: number
      parsed?: { y: unknown }
    }>
    let peakIdx = -1
    let peakValue = -Infinity
    for (let i = 0; i < points.length; i++) {
      const v = points[i]?.parsed?.y
      if (typeof v === 'number' && v > limit && v > peakValue) {
        peakValue = v
        peakIdx = i
      }
    }
    if (peakIdx >= 0) {
      const point = points[peakIdx]!
      const text = `${peakValue.toFixed(1)}h ${labels[peakIdx] ?? ''}`.trim()
      drawChip(
        ctx,
        text,
        point.x,
        point.y - 16, // sit clearly above the dot
        RED,
        RED_TINT,
      )
    }
  },
}
chartPlugins.push(chipsPlugin)

const chartData = computed<ChartData<'line'>>(() => ({
  labels: labels.value,
  datasets: [
    {
      label: `Flight hours (${props.unit})`,
      data: dataValues.value,
      borderColor: ACCENT,
      borderWidth: 2,
      tension: 0.35,
      // Built-in fill is disabled — the segmentFill plugin draws the body
      // behind the line via the canvas API so we can split per-column at
      // the limit (chart.js's native fill splits at a target line, not at
      // the x-axis).
      fill: false,
      // Today's dot renders larger so the user can locate "now" on the line
      // at a glance. Pairs with the dashed vertical line + "Today" axis
      // label as the orientation anchor. 8px (vs the 3px default) is well
      // past the "barely larger" threshold — it's the largest dot on the
      // chart, unambiguously today.
      pointRadius: (ctx: ScriptableContext<'line'>) =>
        ctx.dataIndex === todayIndex.value ? 8 : 3,
      pointBackgroundColor: (ctx: ScriptableContext<'line'>) => colorForPoint(ctx.parsed.y),
      pointBorderColor: (ctx: ScriptableContext<'line'>) => colorForPoint(ctx.parsed.y),
      pointHoverRadius: (ctx: ScriptableContext<'line'>) =>
        ctx.dataIndex === todayIndex.value ? 7 : 5,
      pointHoverBackgroundColor: (ctx: ScriptableContext<'line'>) => colorForPoint(ctx.parsed.y),
      segment: {
        borderColor: (ctx: { p0: { parsed: { y: number | null } }; p1: { parsed: { y: number | null } } }) =>
          colorForSegment(ctx.p0.parsed.y, ctx.p1.parsed.y),
      },
      // Plugin metadata — read by the segmentFill plugin at draw time so
      // limit changes (range toggle) take effect without needing to
      // re-register the plugin (vue-chartjs ignores `plugins` prop changes).
      _segmentFillLimit: props.limit,
      _segmentFillAccent: ACCENT_FILL,
      _segmentFillDanger: DANGER_FILL,
      _todayIndex: todayIndex.value,
      _pointLabels: labels.value,
    } as ChartDataset<'line'> & SegmentFillMeta,
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
  // Reserve top padding so the todayLabelPlugin has canvas room to render
  // the "Today" caption above the plot area, AND so the chipsPlugin has
  // room to render the "{value}h {date}" chip above any peak over-limit
  // data point. 36px covers both comfortably.
  layout: { padding: { top: 36 } },
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
        // The "Today" label at today's x position is NOT done via this
        // callback — chart.js's autoSkip runs BEFORE generateTickLabels, so
        // if today's tick (index 7 of 15) isn't in the surviving maxTicksLimit
        // set, neither this callback nor afterTickToLabelConversion can
        // restore it. The "Today" caption is drawn by the todayLabelPlugin
        // below, which sits outside chart.js's tick system entirely.
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
defineExpose({ chartData, chartOptions, chartPlugins })
</script>

<template>
  <div class="flight-hours-trend-chart" :style="{ height: `${height}px` }">
    <Line :data="chartData" :options="chartOptions" :plugins="chartPlugins" />
  </div>
</template>

<style scoped lang="scss">
.flight-hours-trend-chart {
  width: 100%;
  position: relative;
}
</style>
