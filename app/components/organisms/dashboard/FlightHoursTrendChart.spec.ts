import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FlightHoursTrendChart from './FlightHoursTrendChart.vue'
import { computeRollingSumSeries } from '~/composables/useRollingSum'
import type { FlightHour } from '~/types'

// Tiny fixture: 14 days, 3h/day, ending at TODAY.
const FIXTURE: FlightHour[] = Array.from({ length: 14 }, (_, i) => ({
  date: `2026-05-${String(i + 18).padStart(2, '0')}`,
  hours: 3,
}))
const TODAY = '2026-05-31'

function mountChart(props: Record<string, unknown> = {}) {
  const series = computeRollingSumSeries(FIXTURE, TODAY, 7)
  return mount(FlightHoursTrendChart, {
    props: { series, limit: 40, max: 45, unit: 'h', ...props },
  })
}

describe('FlightHoursTrendChart', () => {
  it('renders a <canvas> inside the chart container', () => {
    const wrapper = mountChart()
    expect(wrapper.find('.flight-hours-trend-chart').exists()).toBe(true)
    expect(wrapper.find('canvas').exists()).toBe(true)
  })

  it('passes exactly 15 series points (the ±7 day window) to the chart', () => {
    const wrapper = mountChart()
    const vm = wrapper.vm as unknown as { chartData: { datasets: Array<{ data: unknown[] }> } }
    const main = vm.chartData.datasets[0]?.data
    expect(main).toHaveLength(15)
  })

  it('the limit line draws as a flat series at `limit`', () => {
    const wrapper = mountChart({ limit: 40 })
    const vm = wrapper.vm as unknown as { chartData: { datasets: Array<{ data: number[] }> } }
    const limitData = vm.chartData.datasets[1]?.data
    expect(limitData).toHaveLength(15)
    expect(limitData?.every((v) => v === 40)).toBe(true)
  })

  it('series value at today (index 7) matches hand-computed rolling-sum (3h × 7 days = 21)', () => {
    const wrapper = mountChart()
    const vm = wrapper.vm as unknown as { chartData: { datasets: Array<{ data: number[] }> } }
    const main = vm.chartData.datasets[0]?.data
    expect(main?.[7]).toBe(21)
  })

  it('chartOptions.scales.y.max equals the `max` prop', () => {
    const wrapper = mountChart({ limit: 100, max: 125 })
    const vm = wrapper.vm as unknown as {
      chartOptions: { scales?: { y?: { max?: number } } }
    }
    expect(vm.chartOptions.scales?.y?.max).toBe(125)
  })

  it('uses 1m series values when given (windowDays=30 hand-check)', () => {
    const series = computeRollingSumSeries(FIXTURE, TODAY, 30)
    const wrapper = mount(FlightHoursTrendChart, {
      props: { series, limit: 100, max: 125 },
    })
    const vm = wrapper.vm as unknown as { chartData: { datasets: Array<{ data: number[] }> } }
    // Today's Y for 1m: all 14 fixture days fall in last 30d → 14 × 3 = 42
    expect(vm.chartData.datasets[0]?.data?.[7]).toBe(42)
  })

  // ---- Coverage gap closure (Phase 7) ----

  it('labels are formatted via shortDate as "D Mon" (e.g., "31 May")', () => {
    const wrapper = mountChart()
    const vm = wrapper.vm as unknown as { chartData: { labels: string[] } }
    expect(vm.chartData.labels[7]).toBe('31 May')
    expect(vm.chartData.labels[0]).toBe('24 May')
  })

  it('chartOptions: y-axis begins at zero, legend hidden', () => {
    const wrapper = mountChart()
    const vm = wrapper.vm as unknown as {
      chartOptions: {
        scales?: { y?: { beginAtZero?: boolean } }
        plugins?: { legend?: { display?: boolean } }
      }
    }
    expect(vm.chartOptions.scales?.y?.beginAtZero).toBe(true)
    expect(vm.chartOptions.plugins?.legend?.display).toBe(false)
  })

  it('tooltip label callback formats value with unit when parsed.y is a number', () => {
    const wrapper = mountChart({ unit: 'h' })
    const vm = wrapper.vm as unknown as {
      chartOptions: {
        plugins?: {
          tooltip?: {
            callbacks?: { label?: (ctx: { parsed: { y: unknown }; dataset: { label?: string } }) => string }
          }
        }
      }
    }
    const label = vm.chartOptions.plugins?.tooltip?.callbacks?.label
    expect(typeof label).toBe('function')
    const result = label!({ parsed: { y: 21 }, dataset: { label: 'Flight hours (h)' } })
    expect(result).toBe('Flight hours (h): 21.0h')
  })

  it('tooltip label callback falls back to 0 when parsed.y is not a number', () => {
    // Covers the `typeof ctx.parsed.y === 'number' ? ... : 0` branch.
    const wrapper = mountChart({ unit: 'h' })
    const vm = wrapper.vm as unknown as {
      chartOptions: {
        plugins?: {
          tooltip?: {
            callbacks?: { label?: (ctx: { parsed: { y: unknown }; dataset: { label?: string } }) => string }
          }
        }
      }
    }
    const label = vm.chartOptions.plugins?.tooltip?.callbacks?.label
    if (!label) throw new Error('tooltip label callback missing')
    const result = label({ parsed: { y: null }, dataset: { label: 'Limit (h)' } })
    expect(result).toBe('Limit (h): 0.0h')
  })

  it('handles an empty series without throwing', () => {
    const wrapper = mount(FlightHoursTrendChart, {
      props: { series: [], limit: 40, max: 45 },
    })
    const vm = wrapper.vm as unknown as { chartData: { datasets: Array<{ data: unknown[] }>; labels: string[] } }
    expect(vm.chartData.datasets[0]?.data).toEqual([])
    expect(vm.chartData.datasets[1]?.data).toEqual([])
    expect(vm.chartData.labels).toEqual([])
  })

  it('shortDate falls back to the raw input when the date is invalid', () => {
    // Drives the `if (Number.isNaN(d.getTime())) return iso` branch inside
    // shortDate (which is private but invoked via chartData.labels).
    const wrapper = mount(FlightHoursTrendChart, {
      props: {
        series: [{ date: 'not-a-date', value: 5 }],
        limit: 40,
        max: 45,
      },
    })
    const vm = wrapper.vm as unknown as { chartData: { labels: string[] } }
    expect(vm.chartData.labels[0]).toBe('not-a-date')
  })

  describe('per-day dots', () => {
    it('enables pointRadius on the flight-hours dataset, with today rendered larger', () => {
      const wrapper = mountChart({ today: TODAY })
      const vm = wrapper.vm as unknown as {
        chartData: {
          datasets: Array<{
            pointRadius?: (ctx: { dataIndex: number }) => number
          }>
        }
      }
      const fn = vm.chartData.datasets[0]!.pointRadius!
      // Normal point → 3; today (index 7) → 8 so the user can spot "now".
      expect(fn({ dataIndex: 0 })).toBe(3)
      expect(fn({ dataIndex: 7 })).toBe(8)
    })
  })

  describe('per-point over-limit coloring', () => {
    type Ctx = { parsed: { y: number } }
    type SegmentCtx = { p0: { parsed: { y: number } }; p1: { parsed: { y: number } } }

    function getColorFns(wrapper: ReturnType<typeof mountChart>) {
      const vm = wrapper.vm as unknown as {
        chartData: {
          datasets: Array<{
            pointBackgroundColor?: (ctx: Ctx) => string
            pointBorderColor?: (ctx: Ctx) => string
            pointHoverBackgroundColor?: (ctx: Ctx) => string
            segment?: { borderColor?: (ctx: SegmentCtx) => string }
          }>
        }
      }
      const ds = vm.chartData.datasets[0]!
      return {
        point: ds.pointBackgroundColor!,
        pointHover: ds.pointHoverBackgroundColor!,
        // Assert segment + borderColor directly (no optional chaining) —
        // `?.borderColor!` would mix optional chain with non-null assertion,
        // which @typescript-eslint/no-non-null-asserted-optional-chain
        // correctly rejects. Both layers are set in chartData, so the
        // assertion is honest.
        segment: ds.segment!.borderColor!,
      }
    }

    it('colors a dot red when its value is over the limit', () => {
      // Limit 10h; fixture peak is 21h.
      const wrapper = mountChart({ limit: 10 })
      const { point } = getColorFns(wrapper)
      expect(point({ parsed: { y: 21 } })).toBe('#E63757')
    })

    it('colors a dot accent when its value is under the limit', () => {
      const wrapper = mountChart({ limit: 10 })
      const { point } = getColorFns(wrapper)
      expect(point({ parsed: { y: 5 } })).toBe('#22C5E8')
    })

    it('keeps the accent baseline borderColor regardless of points', () => {
      // The line's base color stays accent — per-segment coloring is via
      // the `segment.borderColor` scriptable, not the base borderColor.
      const wrapper = mountChart({ limit: 10 })
      const vm = wrapper.vm as unknown as {
        chartData: {
          datasets: Array<{ borderColor?: string }>
        }
      }
      const main = vm.chartData.datasets[0]!
      expect(main.borderColor).toBe('#22C5E8')
    })

    it('disables the built-in dataset fill (the segmentFill plugin draws the body)', () => {
      const wrapper = mountChart()
      const vm = wrapper.vm as unknown as {
        chartData: { datasets: Array<{ fill?: boolean | unknown }> }
      }
      expect(vm.chartData.datasets[0]!.fill).toBe(false)
    })

    it('stashes the segmentFill limit + palette on the dataset so range toggles work without re-registering the plugin', () => {
      // vue-chartjs ignores changes to the `plugins` prop after mount, so the
      // plugin can't read its limit from a closure (it would freeze the
      // initial value and the next range toggle would mis-color). Instead,
      // the limit + palette live on the dataset itself as `_segmentFill*`
      // fields, which chart.js re-reads on every draw.
      const wrapper = mountChart({ limit: 40 })
      const vm = wrapper.vm as unknown as {
        chartData: {
          datasets: Array<{
            _segmentFillLimit?: number
            _segmentFillAccent?: string
            _segmentFillDanger?: string
          }>
        }
        chartPlugins: Array<{ id: string }>
      }
      const ds = vm.chartData.datasets[0]!
      expect(ds._segmentFillLimit).toBe(40)
      expect(ds._segmentFillAccent).toBe('rgba(34, 197, 232, 0.12)')
      expect(ds._segmentFillDanger).toBe('rgba(230, 55, 87, 0.18)')
      // Plugin is a stable singleton (not rebuilt per render) — it reads the
      // current values from the dataset at draw time.
      expect(vm.chartPlugins[0]?.id).toBe('segmentFill')
    })

    it('colors a segment red only when both endpoints are over the limit', () => {
      // Transition segment (one under, one over) stays accent — matches the
      // dot coloring so the line "becomes red" only once it's fully in the
      // over-limit zone, not the moment it touches the limit.
      const wrapper = mountChart({ limit: 10 })
      const { segment } = getColorFns(wrapper)
      // Transition: under → over → accent
      expect(segment({ p0: { parsed: { y: 5 } }, p1: { parsed: { y: 21 } } })).toBe('#22C5E8')
      // Transition: over → under → accent
      expect(segment({ p0: { parsed: { y: 21 } }, p1: { parsed: { y: 5 } } })).toBe('#22C5E8')
      // Fully over → red
      expect(segment({ p0: { parsed: { y: 21 } }, p1: { parsed: { y: 25 } } })).toBe('#E63757')
    })

    it('colors a segment accent when both endpoints are under the limit', () => {
      const wrapper = mountChart({ limit: 40 })
      const { segment } = getColorFns(wrapper)
      expect(segment({ p0: { parsed: { y: 10 } }, p1: { parsed: { y: 15 } } })).toBe('#22C5E8')
    })
  })

  describe('today line', () => {
    it('registers todayLine + todayLabel + chartChips plugins alongside segmentFill', () => {
      const wrapper = mountChart({ today: TODAY })
      const vm = wrapper.vm as unknown as { chartPlugins: Array<{ id: string }> }
      const ids = vm.chartPlugins.map((p) => p.id)
      expect(ids).toContain('segmentFill')
      expect(ids).toContain('todayLine')
      expect(ids).toContain('todayLabel')
      expect(ids).toContain('chartChips')
    })

    it('stashes formatted point labels on the dataset so the chips plugin can read them at draw time', () => {
      const wrapper = mountChart({ today: TODAY })
      const vm = wrapper.vm as unknown as {
        chartData: { datasets: Array<{ _pointLabels?: string[] }> }
      }
      const labels = vm.chartData.datasets[0]!._pointLabels
      expect(labels).toBeDefined()
      expect(labels).toHaveLength(15)
      // Today (index 7) formats to "31 May" via shortDate.
      expect(labels![7]).toBe('31 May')
    })

    it('stashes todayIndex on the dataset when `today` is in the series', () => {
      const wrapper = mountChart({ today: TODAY })
      const vm = wrapper.vm as unknown as {
        chartData: { datasets: Array<{ _todayIndex?: number }> }
      }
      // Fixture: 15-point ±7-day window centered on TODAY → index 7.
      expect(vm.chartData.datasets[0]!._todayIndex).toBe(7)
    })

    it('sets _todayIndex to -1 when today is not provided', () => {
      const wrapper = mountChart()
      const vm = wrapper.vm as unknown as {
        chartData: { datasets: Array<{ _todayIndex?: number }> }
      }
      expect(vm.chartData.datasets[0]!._todayIndex).toBe(-1)
    })

    it('sets _todayIndex to -1 when today is not in the series', () => {
      const wrapper = mountChart({ today: '2099-12-31' })
      const vm = wrapper.vm as unknown as {
        chartData: { datasets: Array<{ _todayIndex?: number }> }
      }
      expect(vm.chartData.datasets[0]!._todayIndex).toBe(-1)
    })
  })
})
