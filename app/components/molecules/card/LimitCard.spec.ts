import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LimitCard from './LimitCard.vue'

describe('LimitCard', () => {
  it('renders the label inside the ring', () => {
    const wrapper = mount(LimitCard, { props: { label: 'Daily', value: 3, limit: 8 } })
    expect(wrapper.find('.progress-ring__label').text()).toBe('Daily')
  })

  it('shows remaining = limit - value', () => {
    const wrapper = mount(LimitCard, { props: { label: 'Daily', value: 3, limit: 8, unit: 'h' } })
    expect(wrapper.find('.limit-card__remaining-value').text()).toBe('5h')
  })

  it('clamps remaining at 0 when value exceeds limit', () => {
    const wrapper = mount(LimitCard, { props: { label: 'Daily', value: 10, limit: 8 } })
    expect(wrapper.find('.limit-card__remaining-value').text()).toBe('0h')
  })

  it('applies warning state at >= 80%', () => {
    const wrapper = mount(LimitCard, { props: { label: 'Daily', value: 7, limit: 8 } })
    expect(wrapper.classes()).toContain('limit-card--warning')
  })

  it('applies danger state at >= 100%', () => {
    const wrapper = mount(LimitCard, { props: { label: 'Daily', value: 8, limit: 8 } })
    expect(wrapper.classes()).toContain('limit-card--danger')
  })

  it('shows "of <limit><unit>" subtitle', () => {
    const wrapper = mount(LimitCard, { props: { label: 'Weekly', value: 28, limit: 40, unit: 'h' } })
    expect(wrapper.find('.limit-card__limit').text()).toBe('of 40h')
  })
})
