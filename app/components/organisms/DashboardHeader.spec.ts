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

  it('emits tap-avatar when avatar clicked', async () => {
    const wrapper = mount(DashboardHeader, { props: { pilotName: 'X' } })
    await wrapper.find('.dashboard-header__avatar-btn').trigger('click')
    expect(wrapper.emitted('tap-avatar')).toHaveLength(1)
  })
})
