import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DashboardHeader from './DashboardHeader.vue'

describe('DashboardHeader', () => {
  it('renders the BrandLogo', () => {
    const wrapper = mount(DashboardHeader, { props: { pilotName: 'John Doe' } })
    expect(wrapper.find('img[src="/susi-air-logo.png"]').exists()).toBe(true)
  })

  it('renders Avatar with the pilot name', () => {
    const wrapper = mount(DashboardHeader, { props: { pilotName: 'John Doe' } })
    expect(wrapper.find('.avatar').exists()).toBe(true)
    expect(wrapper.find('.avatar__fallback').text()).toBe('JD')
  })

  it('shows notification badge only when count > 0', () => {
    const zero = mount(DashboardHeader, { props: { pilotName: 'X', notificationCount: 0 } })
    expect(zero.find('.dashboard-header__notif').exists()).toBe(false)

    const three = mount(DashboardHeader, { props: { pilotName: 'X', notificationCount: 3 } })
    expect(three.find('.dashboard-header__notif').exists()).toBe(true)
    expect(three.find('.dashboard-header__notif-badge').text()).toBe('3')
  })

  it('emits tap-notifications when bell clicked', async () => {
    const wrapper = mount(DashboardHeader, { props: { pilotName: 'X', notificationCount: 1 } })
    await wrapper.find('.dashboard-header__notif').trigger('click')
    expect(wrapper.emitted('tap-notifications')).toHaveLength(1)
  })

  describe('welcome block (pilot name + total flight hours)', () => {
    it('renders a "Welcome back," greeting when pilotName is provided', () => {
      const wrapper = mount(DashboardHeader, { props: { pilotName: 'John Doe' } })
      expect(wrapper.find('.dashboard-header__greeting').text()).toBe('Welcome back,')
      expect(wrapper.find('.dashboard-header__name').text()).toBe('John Doe')
    })

    it('omits the welcome block entirely when no pilotName is provided', () => {
      const wrapper = mount(DashboardHeader, {})
      expect(wrapper.find('.dashboard-header__welcome').exists()).toBe(false)
    })

    it('formats totalFlightHours with thousands separator + "h" suffix (1444.5 → "1,444.5h")', () => {
      const wrapper = mount(DashboardHeader, {
        props: { pilotName: 'John', totalFlightHours: 1444.5 },
      })
      expect(wrapper.find('.dashboard-header__hours').text()).toContain('1,444.5h')
      expect(wrapper.find('.dashboard-header__hours').text()).toContain('total flight time')
    })

    it('formats whole-number hours without trailing .0 (1444 → "1,444h")', () => {
      const wrapper = mount(DashboardHeader, {
        props: { pilotName: 'John', totalFlightHours: 1444 },
      })
      expect(wrapper.find('.dashboard-header__hours').text()).toContain('1,444h')
    })

    it('hides the hours stat when totalFlightHours is not provided', () => {
      const wrapper = mount(DashboardHeader, { props: { pilotName: 'John' } })
      expect(wrapper.find('.dashboard-header__hours').exists()).toBe(false)
    })
  })

  describe('profile dropdown', () => {
    it('is closed initially', () => {
      const wrapper = mount(DashboardHeader, { props: { pilotName: 'John Doe', pilotId: 'PSA-1042' } })
      expect(wrapper.find('.dashboard-header__dropdown').exists()).toBe(false)
      expect(wrapper.find('.dashboard-header__avatar-btn').attributes('aria-expanded')).toBe('false')
    })

    it('opens on avatar click and emits tap-avatar', async () => {
      const wrapper = mount(DashboardHeader, { props: { pilotName: 'John Doe', pilotId: 'PSA-1042' } })
      await wrapper.find('.dashboard-header__avatar-btn').trigger('click')
      expect(wrapper.find('.dashboard-header__dropdown').exists()).toBe(true)
      expect(wrapper.find('.dashboard-header__avatar-btn').attributes('aria-expanded')).toBe('true')
      expect(wrapper.emitted('tap-avatar')).toHaveLength(1)
    })

    it('renders pilot name and ID in the dropdown', async () => {
      const wrapper = mount(DashboardHeader, { props: { pilotName: 'John Doe', pilotId: 'PSA-1042' } })
      await wrapper.find('.dashboard-header__avatar-btn').trigger('click')
      expect(wrapper.find('.dashboard-header__dropdown-name').text()).toBe('John Doe')
      expect(wrapper.find('.dashboard-header__dropdown-id').text()).toBe('Pilot ID · PSA-1042')
    })

    it('emits logout and closes when logout button clicked', async () => {
      const wrapper = mount(DashboardHeader, { props: { pilotName: 'John', pilotId: 'PSA-1' } })
      await wrapper.find('.dashboard-header__avatar-btn').trigger('click')
      await wrapper.find('.dashboard-header__logout').trigger('click')
      expect(wrapper.emitted('logout')).toHaveLength(1)
      expect(wrapper.find('.dashboard-header__dropdown').exists()).toBe(false)
    })

    it('closes on Escape key', async () => {
      const wrapper = mount(DashboardHeader, { props: { pilotName: 'John', pilotId: 'PSA-1' } })
      await wrapper.find('.dashboard-header__avatar-btn').trigger('click')
      expect(wrapper.find('.dashboard-header__dropdown').exists()).toBe(true)

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.dashboard-header__dropdown').exists()).toBe(false)
    })

    it('closes on outside click', async () => {
      const wrapper = mount(DashboardHeader, { props: { pilotName: 'John', pilotId: 'PSA-1' } })
      await wrapper.find('.dashboard-header__avatar-btn').trigger('click')
      expect(wrapper.find('.dashboard-header__dropdown').exists()).toBe(true)

      // Click outside the header entirely.
      document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.dashboard-header__dropdown').exists()).toBe(false)
    })

    it('toggles closed when avatar clicked while open', async () => {
      const wrapper = mount(DashboardHeader, { props: { pilotName: 'John', pilotId: 'PSA-1' } })
      const btn = wrapper.find('.dashboard-header__avatar-btn')
      await btn.trigger('click') // open
      expect(wrapper.find('.dashboard-header__dropdown').exists()).toBe(true)
      await btn.trigger('click') // close
      expect(wrapper.find('.dashboard-header__dropdown').exists()).toBe(false)
    })

    it('omits the ID line when pilotId is not provided', async () => {
      const wrapper = mount(DashboardHeader, { props: { pilotName: 'John' } })
      await wrapper.find('.dashboard-header__avatar-btn').trigger('click')
      expect(wrapper.find('.dashboard-header__dropdown-id').exists()).toBe(false)
    })
  })
})
