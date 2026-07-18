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
})
