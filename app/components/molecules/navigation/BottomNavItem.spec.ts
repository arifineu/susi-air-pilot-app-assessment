import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BottomNavItem from './BottomNavItem.vue'

describe('BottomNavItem', () => {
  it('renders the label and icon', () => {
    const wrapper = mount(BottomNavItem, { props: { label: 'Home', icon: 'home' } })
    expect(wrapper.find('.bottom-nav-item__label').text()).toBe('Home')
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('applies active modifier and aria-current', () => {
    const wrapper = mount(BottomNavItem, { props: { label: 'Home', icon: 'home', active: true } })
    expect(wrapper.classes()).toContain('bottom-nav-item--active')
    expect(wrapper.attributes('aria-current')).toBe('page')
  })

  it('emits click', async () => {
    const wrapper = mount(BottomNavItem, { props: { label: 'Home', icon: 'home' } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('shows badge when provided', () => {
    const wrapper = mount(BottomNavItem, { props: { label: 'X', icon: 'home', badge: 5 } })
    expect(wrapper.find('.bottom-nav-item__badge').text()).toBe('5')
  })

  it('does not show badge when not provided', () => {
    const wrapper = mount(BottomNavItem, { props: { label: 'X', icon: 'home' } })
    expect(wrapper.find('.bottom-nav-item__badge').exists()).toBe(false)
  })
})
