import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ScheduleCalendarGrid from './ScheduleCalendarGrid.vue'
import schedulesData from '~/assets/data/mock-schedules.json'

const TODAY = '2026-05-15'

function mountGrid(yearMonth = '2026-05') {
  return mount(ScheduleCalendarGrid, {
    props: {
      schedules: schedulesData.schedules,
      legend: schedulesData.legend,
      yearMonth,
      today: TODAY,
    },
  })
}

describe('ScheduleCalendarGrid', () => {
  it('renders the month label in human-readable form', () => {
    const wrapper = mountGrid('2026-05')
    expect(wrapper.find('.schedule-calendar-grid__month').text()).toBe('May 2026')
  })

  it('renders 7 weekday headers', () => {
    const wrapper = mountGrid()
    const headers = wrapper.findAll('.schedule-calendar-grid__weekday').map((n) => n.text())
    expect(headers).toEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'])
  })

  it('renders 6 × 7 = 42 day cells', () => {
    const wrapper = mountGrid()
    expect(wrapper.findAll('.calendar-day')).toHaveLength(42)
  })

  it('emits update:yearMonth with previous month when left arrow clicked', async () => {
    const wrapper = mountGrid('2026-05')
    const navButtons = wrapper.findAll('.schedule-calendar-grid__nav')
    await navButtons[0]?.trigger('click') // left arrow
    expect(wrapper.emitted('update:yearMonth')?.[0]).toEqual(['2026-04'])
  })

  it('emits update:yearMonth with next month when right arrow clicked', async () => {
    const wrapper = mountGrid('2026-05')
    const navButtons = wrapper.findAll('.schedule-calendar-grid__nav')
    await navButtons[1]?.trigger('click') // right arrow
    expect(wrapper.emitted('update:yearMonth')?.[0]).toEqual(['2026-06'])
  })

  it('rolls over year when navigating past December or before January', async () => {
    const dec = mountGrid('2026-12')
    await dec.findAll('.schedule-calendar-grid__nav')[1]?.trigger('click')
    expect(dec.emitted('update:yearMonth')?.[0]).toEqual(['2027-01'])

    const jan = mountGrid('2026-01')
    await jan.findAll('.schedule-calendar-grid__nav')[0]?.trigger('click')
    expect(jan.emitted('update:yearMonth')?.[0]).toEqual(['2025-12'])
  })

  it('emits select-date with the ISO date when a cell is clicked', async () => {
    const wrapper = mountGrid('2026-05')
    await wrapper.find('.calendar-day').trigger('click')
    // First cell is the Sunday on or before 2026-05-01 → 2026-04-26
    expect(wrapper.emitted('select-date')?.[0]).toEqual(['2026-04-26'])
  })

  it('renders schedule-matched cells with the JSON-driven base_color', () => {
    const wrapper = mountGrid('2026-05')
    const todayCell = wrapper
      .findAll('.calendar-day')
      .find((c) => c.classes().includes('calendar-day--today'))
    expect(todayCell).toBeDefined()
    expect(todayCell?.attributes('style') || '').toContain('--day-color')
  })

  it('renders today modifier on exactly one cell when today falls in month', () => {
    const wrapper = mountGrid('2026-05') // today = 2026-05-15
    const todayCells = wrapper.findAll('.calendar-day--today')
    expect(todayCells).toHaveLength(1)
  })
})
