import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DayFlightsModal from './DayFlightsModal.vue'
import type { Flight } from '~/types'

interface DayEntry { date: string; flights: Flight[] }

const flight = (overrides: Partial<Flight>): Flight => ({
  id: 'f1',
  flight_number: 'SSI-2204',
  aircraft: 'LET 410',
  aircraft_registration: 'PK-LRB',
  departure: { icao: 'PDG', city: 'Padang', time: '14:30' },
  arrival: { icao: 'MKW', city: 'Mukomuko', time: '15:45' },
  duration_minutes: 75,
  status: 1,
  ...overrides,
})

const completedFlight = flight({
  id: 'f-completed',
  flight_number: 'SSI-1801',
  status: 2,
  departure: { icao: 'MKW', city: 'Mukomuko', time: '08:30' },
  arrival: { icao: 'PDG', city: 'Padang', time: '09:45' },
})

const upcomingFlight = flight({
  id: 'f-upcoming',
  flight_number: 'SSI-2204',
})

const defaultDays: DayEntry[] = [
  { date: '2026-05-31', flights: [completedFlight, upcomingFlight] },
  { date: '2026-06-01', flights: [flight({ id: 'f2', flight_number: 'SSI-2301' })] },
  { date: '2026-06-02', flights: [flight({ id: 'f3', flight_number: 'SSI-2302' }), flight({ id: 'f4', flight_number: 'SSI-2304' })] },
  { date: '2026-06-03', flights: [flight({ id: 'f5', flight_number: 'SSI-2401' })] },
]

function mountModal(overrides: Partial<{ open: boolean; days: DayEntry[] }> = {}) {
  return mount(DayFlightsModal, {
    props: { open: true, days: defaultDays, ...overrides },
  })
}

describe('DayFlightsModal', () => {
  it('renders nothing when open=false', () => {
    const wrapper = mountModal({ open: false })
    expect(wrapper.find('.day-flights-modal').exists()).toBe(false)
  })

  it('renders the first day as the title on open', () => {
    const wrapper = mountModal()
    expect(wrapper.find('.day-flights-modal__title').text()).toBe('Sunday, 31 May 2026')
  })

  it('renders all flights for the current day', () => {
    const wrapper = mountModal()
    // defaultDays[0] has 2 flights (completed + upcoming)
    expect(wrapper.findAll('.day-flights-modal__flight')).toHaveLength(2)
  })

  it('applies the muted class to completed flights (status=2)', () => {
    const wrapper = mountModal()
    const completed = wrapper.findAll('.day-flights-modal__flight--completed')
    expect(completed).toHaveLength(1)
    expect(completed[0]?.text()).toContain('SSI-1801')
  })

  it('shows the Completed badge on status=2 and Upcoming on status=1', () => {
    const wrapper = mountModal()
    const labels = wrapper.findAll('.badge__label').map((n) => n.text())
    expect(labels).toContain('Completed')
    expect(labels).toContain('Upcoming')
  })

  it('shows an empty state when the current day has no flights', () => {
    const wrapper = mountModal({ days: [{ date: '2026-05-31', flights: [] }] })
    expect(wrapper.find('.day-flights-modal__empty').text()).toBe('No flights scheduled.')
  })

  it('emits close when the × button is clicked', async () => {
    const wrapper = mountModal()
    await wrapper.find('.day-flights-modal__close').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('emits close when the backdrop is clicked', async () => {
    const wrapper = mountModal()
    await wrapper.find('.day-flights-modal__backdrop').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  describe('navigation', () => {
    it('disables Prev on first render (day 0)', () => {
      const wrapper = mountModal()
      const prev = wrapper.findAll('.day-flights-modal__nav')[0]!
      expect(prev.attributes('disabled')).toBeDefined()
    })

    it('enables Next on first render when there are more days', () => {
      const wrapper = mountModal()
      const next = wrapper.findAll('.day-flights-modal__nav')[1]!
      expect(next.attributes('disabled')).toBeUndefined()
    })

    it('advances one day when Next is clicked', async () => {
      const wrapper = mountModal()
      const next = wrapper.findAll('.day-flights-modal__nav')[1]!
      await next.trigger('click')
      expect(wrapper.find('.day-flights-modal__title').text()).toBe('Monday, 1 June 2026')
    })

    it('disables Next on the last day', async () => {
      const wrapper = mountModal()
      const next = wrapper.findAll('.day-flights-modal__nav')[1]!
      // 4 entries → 3 clicks to reach the last
      await next.trigger('click') // → 06-01
      await next.trigger('click') // → 06-02
      await next.trigger('click') // → 06-03 (last)
      expect(next.attributes('disabled')).toBeDefined()
    })

    it('enables Prev after moving forward', async () => {
      const wrapper = mountModal()
      const next = wrapper.findAll('.day-flights-modal__nav')[1]!
      const prev = wrapper.findAll('.day-flights-modal__nav')[0]!
      await next.trigger('click')
      expect(prev.attributes('disabled')).toBeUndefined()
    })

    it('retreats one day when Prev is clicked', async () => {
      const wrapper = mountModal()
      const next = wrapper.findAll('.day-flights-modal__nav')[1]!
      const prev = wrapper.findAll('.day-flights-modal__nav')[0]!
      await next.trigger('click') // 05-31 → 06-01
      await prev.trigger('click') // 06-01 → 05-31
      expect(wrapper.find('.day-flights-modal__title').text()).toBe('Sunday, 31 May 2026')
      expect(prev.attributes('disabled')).toBeDefined()
    })

    it('resets to day 0 when the modal reopens', async () => {
      const wrapper = mountModal()
      const next = wrapper.findAll('.day-flights-modal__nav')[1]!
      await next.trigger('click')
      // User has navigated to 06-01.
      expect(wrapper.find('.day-flights-modal__title').text()).toBe('Monday, 1 June 2026')
      // Close + reopen.
      await wrapper.setProps({ open: false })
      await wrapper.setProps({ open: true })
      expect(wrapper.find('.day-flights-modal__title').text()).toBe('Sunday, 31 May 2026')
    })

    it('does not advance past the last day on extra Next clicks', async () => {
      const wrapper = mountModal()
      const next = wrapper.findAll('.day-flights-modal__nav')[1]!
      for (let i = 0; i < 6; i++) await next.trigger('click')
      expect(wrapper.find('.day-flights-modal__title').text()).toBe('Wednesday, 3 June 2026')
    })
  })

  describe('swipe gestures', () => {
    /** Build a fake TouchEvent with the appropriate touches / changedTouches shape. */
    function makeTouchEvent(
      clientX: number,
      clientY: number,
      type: 'touchstart' | 'touchend',
    ): TouchEvent {
      const touch = { clientX, clientY, identifier: 0, target: document.body }
      return {
        touches: type === 'touchstart' ? [touch] : [],
        changedTouches: type === 'touchend' ? [touch] : [],
        length: type === 'touchstart' ? 1 : 0,
      } as unknown as TouchEvent
    }

    function swipe(wrapper: ReturnType<typeof mountModal>, fromX: number, fromY: number, toX: number, toY: number) {
      const vm = wrapper.vm as unknown as {
        onTouchStart: (e: TouchEvent) => void
        onTouchEnd: (e: TouchEvent) => void
      }
      vm.onTouchStart(makeTouchEvent(fromX, fromY, 'touchstart'))
      vm.onTouchEnd(makeTouchEvent(toX, toY, 'touchend'))
    }

    it('advances to the next day on a leftward swipe (dx < -threshold)', async () => {
      const wrapper = mountModal()
      swipe(wrapper, 200, 100, 100, 100) // dx = -100, dy = 0
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.day-flights-modal__title').text()).toBe('Monday, 1 June 2026')
    })

    it('retreats to the previous day on a rightward swipe (dx > threshold)', async () => {
      const wrapper = mountModal()
      // First move forward so Prev is unblocked.
      swipe(wrapper, 200, 100, 100, 100)
      await wrapper.vm.$nextTick()
      // Then swipe back right.
      swipe(wrapper, 100, 100, 200, 100)
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.day-flights-modal__title').text()).toBe('Sunday, 31 May 2026')
    })

    it('ignores a swipe below the threshold distance', async () => {
      const wrapper = mountModal()
      swipe(wrapper, 200, 100, 190, 100) // dx = -10, below SWIPE_THRESHOLD of 20
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.day-flights-modal__title').text()).toBe('Sunday, 31 May 2026')
    })

    it('ignores a mostly-vertical swipe so body scrolling still works', async () => {
      const wrapper = mountModal()
      swipe(wrapper, 200, 100, 220, 400) // |dx| = 20, |dy| = 300 — vertical dominant
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.day-flights-modal__title').text()).toBe('Sunday, 31 May 2026')
    })

    it('does nothing at day 0 on a rightward swipe (boundary)', async () => {
      const wrapper = mountModal()
      swipe(wrapper, 100, 100, 300, 100) // rightward at day 0
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.day-flights-modal__title').text()).toBe('Sunday, 31 May 2026')
    })

    it('does nothing at the last day on a leftward swipe (boundary)', async () => {
      const wrapper = mountModal()
      // Jump to the last day via buttons.
      const next = wrapper.findAll('.day-flights-modal__nav')[1]!
      for (let i = 0; i < 3; i++) {
        await next.trigger('click')
      }
      expect(wrapper.find('.day-flights-modal__title').text()).toBe('Wednesday, 3 June 2026')
      // Leftward swipe at the last day — should not advance.
      swipe(wrapper, 200, 100, 100, 100)
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.day-flights-modal__title').text()).toBe('Wednesday, 3 June 2026')
    })
  })
})
