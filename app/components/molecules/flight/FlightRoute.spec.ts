import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FlightRoute from './FlightRoute.vue'

describe('FlightRoute', () => {
  it('renders both ICAO codes', () => {
    const wrapper = mount(FlightRoute, {
      props: { departure: { icao: 'PDG' }, arrival: { icao: 'MKW' } },
    })
    const codes = wrapper.findAll('.flight-route__icao').map((n) => n.text())
    expect(codes).toEqual(['PDG', 'MKW'])
  })

  it('renders the optional city names', () => {
    const wrapper = mount(FlightRoute, {
      props: {
        departure: { icao: 'PDG', city: 'Padang' },
        arrival: { icao: 'MKW', city: 'Mukomuko' },
      },
    })
    const cities = wrapper.findAll('.flight-route__city').map((n) => n.text())
    expect(cities).toEqual(['Padang', 'Mukomuko'])
  })

  it('hides city block when not provided', () => {
    const wrapper = mount(FlightRoute, {
      props: { departure: { icao: 'PDG' }, arrival: { icao: 'MKW' } },
    })
    expect(wrapper.find('.flight-route__city').exists()).toBe(false)
  })

  it('renders the flight number when provided', () => {
    const wrapper = mount(FlightRoute, {
      props: {
        departure: { icao: 'PDG' },
        arrival: { icao: 'MKW' },
        flightNumber: 'SSI-2204',
      },
    })
    expect(wrapper.find('.flight-route__flightno').text()).toBe('SSI-2204')
  })

  it('renders the plane icon between the airports', () => {
    const wrapper = mount(FlightRoute, {
      props: { departure: { icao: 'PDG' }, arrival: { icao: 'MKW' } },
    })
    expect(wrapper.find('.flight-route__plane').exists()).toBe(true)
    expect(wrapper.find('svg').exists()).toBe(true)
  })
})
