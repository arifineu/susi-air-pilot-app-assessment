import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UpcomingFlightCard from './UpcomingFlightCard.vue'
import type { Flight, Schedule } from '~/types'

const baseSchedule: Schedule = {
  id: '97037',
  duty_date: '2026-05-31',
  status: 1,
  base_name: 'MKW',
  base_color: '#10B981',
  duty_type: 'DTY',
  count_schedules: 3,
  count_logbooks: 1,
}

const baseFlight: Flight = {
  id: '97037-2',
  flight_number: 'SSI-2204',
  aircraft: 'LET 410',
  aircraft_registration: 'PK-LRB',
  departure: { icao: 'PDG', city: 'Padang', time: '14:30' },
  arrival: { icao: 'MKW', city: 'Mukomuko', time: '15:45' },
  duration_minutes: 75,
  status: 1,
}

function mountCard(overrides: { schedule?: Partial<Schedule>; flight?: Partial<Flight> } = {}) {
  return mount(UpcomingFlightCard, {
    props: {
      schedule: { ...baseSchedule, ...overrides.schedule },
      flight: { ...baseFlight, ...overrides.flight },
    },
  })
}

describe('UpcomingFlightCard', () => {
  it('renders the "Next flight" label', () => {
    const wrapper = mountCard()
    expect(wrapper.find('.upcoming-flight-card__label').text()).toBe('Next flight')
  })

  it('renders the formatted date above the route', () => {
    const wrapper = mountCard()
    expect(wrapper.find('.upcoming-flight-card__date').text()).toBe('Sunday, 31 May 2026')
  })

  it('shows Upcoming badge when schedule.status=1', () => {
    const wrapper = mountCard()
    expect(wrapper.find('.badge--neutral').exists()).toBe(true)
    expect(wrapper.find('.badge__label').text()).toBe('Upcoming')
  })

  it('shows Verified badge when schedule.status=2', () => {
    const wrapper = mountCard({ schedule: { status: 2 } })
    expect(wrapper.find('.badge--safe').exists()).toBe(true)
    expect(wrapper.find('.badge__label').text()).toBe('Verified')
  })

  it('renders the FlightRoute ICAOs from the flight', () => {
    const wrapper = mountCard()
    const codes = wrapper.findAll('.flight-route__icao').map((n) => n.text())
    expect(codes).toEqual(['PDG', 'MKW'])
  })

  it('renders the flight number header on the route', () => {
    const wrapper = mountCard()
    expect(wrapper.find('.flight-route__flightno').text()).toBe('SSI-2204')
  })

  it('renders dep + arr times', () => {
    const wrapper = mountCard()
    const values = wrapper.findAll('.upcoming-flight-card__time-value').map((n) => n.text())
    expect(values).toEqual(['14:30', '15:45'])
  })

  it('renders duration, aircraft, and registration in the meta row', () => {
    const wrapper = mountCard()
    const meta = wrapper.find('.upcoming-flight-card__meta').text()
    expect(meta).toContain('1h 15m')
    expect(meta).toContain('LET 410')
    expect(meta).toContain('PK-LRB')
  })

  it('shows "View all" button when schedule.count_schedules > 1', () => {
    const wrapper = mountCard()
    expect(wrapper.find('.upcoming-flight-card__view-all').exists()).toBe(true)
    expect(wrapper.find('.upcoming-flight-card__view-all').text()).toContain('3')
  })

  it('hides "View all" button when count_schedules is 1', () => {
    const wrapper = mountCard({ schedule: { count_schedules: 1 } })
    expect(wrapper.find('.upcoming-flight-card__view-all').exists()).toBe(false)
  })

  it('emits view-all when the button is clicked', async () => {
    const wrapper = mountCard()
    await wrapper.find('.upcoming-flight-card__view-all').trigger('click')
    expect(wrapper.emitted('view-all')).toHaveLength(1)
  })
})
