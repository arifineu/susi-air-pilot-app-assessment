import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UpcomingFlightCard from './UpcomingFlightCard.vue'
import type { Schedule } from '~/types'

const baseSchedule: Schedule = {
  id: '1',
  duty_date: '2026-05-31',
  status: 1,
  base_name: 'MKW',
  base_color: '#10B981',
  duty_type: 'DTY',
  count_schedules: 2,
  count_logbooks: 0,
}

describe('UpcomingFlightCard', () => {
  it('renders the "Next duty" label', () => {
    const wrapper = mount(UpcomingFlightCard, {
      props: { schedule: baseSchedule, departure: { icao: 'PDG' }, arrival: { icao: 'MKW' } },
    })
    expect(wrapper.find('.upcoming-flight-card__label').text()).toBe('Next duty')
  })

  it('shows Upcoming badge when status=1', () => {
    const wrapper = mount(UpcomingFlightCard, {
      props: { schedule: baseSchedule, departure: { icao: 'PDG' }, arrival: { icao: 'MKW' } },
    })
    expect(wrapper.find('.badge--neutral').exists()).toBe(true)
    expect(wrapper.find('.badge__label').text()).toBe('Upcoming')
  })

  it('shows Verified badge when status=2', () => {
    const wrapper = mount(UpcomingFlightCard, {
      props: {
        schedule: { ...baseSchedule, status: 2 },
        departure: { icao: 'PDG' },
        arrival: { icao: 'MKW' },
      },
    })
    expect(wrapper.find('.badge--safe').exists()).toBe(true)
    expect(wrapper.find('.badge__label').text()).toBe('Verified')
  })

  it('renders the FlightRoute ICAOs', () => {
    const wrapper = mount(UpcomingFlightCard, {
      props: {
        schedule: baseSchedule,
        departure: { icao: 'PDG', city: 'Padang' },
        arrival: { icao: 'MKW', city: 'Mukomuko' },
      },
    })
    const codes = wrapper.findAll('.flight-route__icao').map((n) => n.text())
    expect(codes).toEqual(['PDG', 'MKW'])
  })

  it('renders the times row when at least one time is provided', () => {
    const wrapper = mount(UpcomingFlightCard, {
      props: {
        schedule: baseSchedule,
        departure: { icao: 'PDG' },
        arrival: { icao: 'MKW' },
        departureTime: '08:15',
        arrivalTime: '09:40',
      },
    })
    expect(wrapper.find('.upcoming-flight-card__times').exists()).toBe(true)
    expect(wrapper.find('.upcoming-flight-card__time-value').text()).toBe('08:15')
  })

  it('hides the times row when no times are provided', () => {
    const wrapper = mount(UpcomingFlightCard, {
      props: { schedule: baseSchedule, departure: { icao: 'PDG' }, arrival: { icao: 'MKW' } },
    })
    expect(wrapper.find('.upcoming-flight-card__times').exists()).toBe(false)
  })

  it('falls back to schedule.base_name when departure/arrival not provided', () => {
    const wrapper = mount(UpcomingFlightCard, { props: { schedule: baseSchedule } })
    // Both sides will show MKW (the schedule's base_name)
    const codes = wrapper.findAll('.flight-route__icao').map((n) => n.text())
    expect(codes).toEqual(['MKW', 'MKW'])
  })
})
