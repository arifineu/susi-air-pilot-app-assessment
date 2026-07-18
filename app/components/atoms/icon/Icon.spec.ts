import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Icon from './Icon.vue'
import { Plane } from '@lucide/vue'

describe('Icon', () => {
  it('resolves kebab-case name to a lucide component', () => {
    const wrapper = mount(Icon, { props: { name: 'plane' } })
    // Lucide renders an <svg>; missing-fallback span should NOT appear.
    expect(wrapper.find('.icon--missing').exists()).toBe(false)
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('resolves PascalCase name', () => {
    const wrapper = mount(Icon, { props: { name: 'Clock' } })
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('passes size and stroke-width attributes', () => {
    const wrapper = mount(Icon, { props: { name: 'plane', size: 32, strokeWidth: 2 } })
    const svg = wrapper.find('svg')
    expect(svg.attributes('width')).toBe('32')
    expect(svg.attributes('stroke-width')).toBe('2')
  })

  it('renders the fallback span for unknown icons', () => {
    const wrapper = mount(Icon, { props: { name: 'totally-fake-icon' } })
    expect(wrapper.find('.icon--missing').exists()).toBe(true)
    expect(wrapper.find('.icon--missing').attributes('aria-label')).toBe('totally-fake-icon')
  })

  it('marks the icon decorative when asked', () => {
    const wrapper = mount(Icon, { props: { name: 'plane', decorative: true } })
    expect(wrapper.find('svg').attributes('aria-hidden')).toBe('true')
  })

  it('renders an actual lucide component (sanity)', () => {
    const wrapper = mount(Icon, { props: { name: 'plane' } })
    // The resolved component is a lucide-vue-next functional component.
    expect(wrapper.findComponent(Plane).exists()).toBe(true)
  })
})
