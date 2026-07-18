import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HoursToLimitSection from './HoursToLimitSection.vue'
import { computeRollingSumSeries } from '~/composables/useRollingSum'
import type { ChartBounds, ChartRangeKey, FlightHour, FlightLimits } from '~/types'

// Tiny fixture: 14 days × 3h ending at TODAY.
const FIXTURE: FlightHour[] = Array.from({ length: 14 }, (_, i) => ({
  date: `2026-05-${String(i + 18).padStart(2, '0')}`,
  hours: 3,
}))
const TODAY = '2026-05-31'

const LIMITS: FlightLimits = { daily: 8, weekly: 40, monthly: 100, annual: 1050 }
const CHART_BOUNDS: Record<ChartRangeKey, ChartBounds> = {
  '1w': { limit: 40, max: 45, windowDays: 7, displayRangeDays: 7 },
  '1m': { limit: 100, max: 125, windowDays: 30, displayRangeDays: 7 },
  '3m': { limit: 300, max: 325, windowDays: 90, displayRangeDays: 7 },
  '6m': { limit: 600, max: 625, windowDays: 180, displayRangeDays: 7 },
  '1y': { limit: 1050, max: 1200, windowDays: 365, displayRangeDays: 7 },
}

function mountSection(initialRange: ChartRangeKey = '1w') {
  return mount(HoursToLimitSection, {
    props: {
      flightHours: FIXTURE,
      limits: LIMITS,
      chartBounds: CHART_BOUNDS,
      today: TODAY,
      initialRange,
    },
  })
}

describe('HoursToLimitSection', () => {
  it('renders the title, RangeToggleGroup, chart, and 4 LimitCards', () => {
    const wrapper = mountSection()
    expect(wrapper.find('.hours-to-limit-section__title').text()).toBe('Hours to Limit')
    expect(wrapper.findComponent({ name: 'RangeToggleGroup' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'FlightHoursTrendChart' }).exists()).toBe(true)
    expect(wrapper.findAllComponents({ name: 'LimitCard' })).toHaveLength(4)
  })

  it('initial range is the prop value', () => {
    const oneM = mountSection('1m')
    const active = oneM.findAll('.range-toggle-group__option--active')
    expect(active).toHaveLength(1)
    expect(active[0]?.text()).toBe('1M')
  })

  it('emits range-change when toggle changes', async () => {
    const wrapper = mountSection('1w')
    const buttons = wrapper.findAll('.range-toggle-group__option')
    await buttons[2]?.trigger('click') // 3M
    expect(wrapper.emitted('range-change')?.[0]).toEqual(['3m'])
  })

  it('LimitCard values are independent of the range toggle', async () => {
    const wrapper = mountSection('1w')
    const getCardValues = () =>
      wrapper.findAllComponents({ name: 'LimitCard' }).map((c) => c.props('value'))

    const at1w = getCardValues()
    // Toggle to 1y — limit card values should be unchanged
    const buttons = wrapper.findAll('.range-toggle-group__option')
    await buttons[4]?.trigger('click') // 1Y
    const at1y = getCardValues()
    expect(at1y).toEqual(at1w)

    // Hand-computed: daily=3 (today only), weekly=21 (7×3), monthly=42 (14×3), annual=42
    expect(at1w).toEqual([3, 21, 42, 42])
  })

  it('chart series uses the active range\'s windowDays', async () => {
    const wrapper = mountSection('1w')
    const chartCmp = () => wrapper.findComponent({ name: 'FlightHoursTrendChart' })

    // At 1w: today value (index 7 of series) = 7×3 = 21
    const series1w = chartCmp().props('series')
    expect(series1w[7]?.value).toBe(21)

    // Toggle to 1m
    const buttons = wrapper.findAll('.range-toggle-group__option')
    await buttons[1]?.trigger('click') // 1M
    await wrapper.vm.$nextTick()

    // At 1m: today value = 14×3 = 42 (all fixture days in last 30d)
    const series1m = chartCmp().props('series')
    expect(series1m[7]?.value).toBe(42)
  })

  it('chart series is always 15 points (±7 window) regardless of range', async () => {
    const wrapper = mountSection('1w')
    const seriesAt = () => wrapper.findComponent({ name: 'FlightHoursTrendChart' }).props('series')

    expect(seriesAt()).toHaveLength(15)

    const buttons = wrapper.findAll('.range-toggle-group__option')
    await buttons[4]?.trigger('click') // 1Y
    await wrapper.vm.$nextTick()
    expect(seriesAt()).toHaveLength(15)
  })

  it('chart series dates match hand-computed computeRollingSumSeries output', () => {
    const wrapper = mountSection('1w')
    const series = wrapper.findComponent({ name: 'FlightHoursTrendChart' }).props('series')
    const expected = computeRollingSumSeries(FIXTURE, TODAY, 7)
    expect(series.map((p: { date: string }) => p.date)).toEqual(expected.map((p) => p.date))
  })

  it('passes the active range\'s limit/max to the chart', async () => {
    const wrapper = mountSection('1w')
    const chartProps = () => wrapper.findComponent({ name: 'FlightHoursTrendChart' }).props()
    expect(chartProps().limit).toBe(40)
    expect(chartProps().max).toBe(45)

    const buttons = wrapper.findAll('.range-toggle-group__option')
    await buttons[1]?.trigger('click') // 1M
    await wrapper.vm.$nextTick()
    expect(chartProps().limit).toBe(100)
    expect(chartProps().max).toBe(125)
  })
})
