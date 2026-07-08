import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BottomNavigation from './BottomNavigation.vue'
import type { NavItem } from '~/types'

const items: NavItem[] = [
  { label: 'Home', icon: 'home', to: '/home' },
  { label: 'Schedule', icon: 'calendar', to: '/schedule' },
  { label: 'Logbook', icon: 'book', to: '/logbook', badge: 3 },
]

describe('BottomNavigation', () => {
  it('renders one BottomNavItem per item', () => {
    const wrapper = mount(BottomNavigation, { props: { items, activeRoute: '/home' } })
    expect(wrapper.findAll('.bottom-nav-item')).toHaveLength(3)
    expect(wrapper.findAll('.bottom-nav-item__label').map((n) => n.text())).toEqual([
      'Home',
      'Schedule',
      'Logbook',
    ])
  })

  it('marks the active item', () => {
    const wrapper = mount(BottomNavigation, { props: { items, activeRoute: '/schedule' } })
    const active = wrapper.findAll('.bottom-nav-item--active')
    expect(active).toHaveLength(1)
    expect(active[0]?.text()).toContain('Schedule')
  })

  it('emits navigate with the route path when item clicked', async () => {
    const wrapper = mount(BottomNavigation, { props: { items, activeRoute: '/home' } })
    const buttons = wrapper.findAll('.bottom-nav-item')
    await buttons[1]?.trigger('click')
    expect(wrapper.emitted('navigate')?.[0]).toEqual(['/schedule'])
  })

  it('passes badge through to children', () => {
    const wrapper = mount(BottomNavigation, { props: { items, activeRoute: '/home' } })
    const badges = wrapper.findAll('.bottom-nav-item__badge')
    expect(badges).toHaveLength(1)
    expect(badges[0]?.text()).toBe('3')
  })
})
