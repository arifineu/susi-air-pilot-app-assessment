import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProgressBar from './ProgressBar.vue'

describe('ProgressBar', () => {
  it('renders a track and a fill element', () => {
    const wrapper = mount(ProgressBar, { props: { value: 4, max: 8, showValue: false } })
    expect(wrapper.find('.progress-bar__track').exists()).toBe(true)
    expect(wrapper.find('.progress-bar__fill').exists()).toBe(true)
  })

  it('applies the safe modifier when value is under threshold', () => {
    const wrapper = mount(ProgressBar, { props: { value: 4, max: 8 } })
    expect(wrapper.classes()).toContain('progress-bar--safe')
  })

  it('applies warning at >= 80%', () => {
    const wrapper = mount(ProgressBar, { props: { value: 33, max: 40 } })
    expect(wrapper.classes()).toContain('progress-bar--warning')
  })

  it('applies danger at >= 100%', () => {
    const wrapper = mount(ProgressBar, { props: { value: 100, max: 100 } })
    expect(wrapper.classes()).toContain('progress-bar--danger')
  })

  it('clamps overflow into the bar width', () => {
    const wrapper = mount(ProgressBar, { props: { value: 99, max: 8, showValue: false } })
    expect(wrapper.find('.progress-bar__fill').attributes('style')).toContain('width: 100%')
  })

  it('shows the value/max with unit in the caption', () => {
    const wrapper = mount(ProgressBar, { props: { value: 4, max: 8, unit: 'h', label: 'Daily' } })
    expect(wrapper.find('.progress-bar__value').text()).toContain('4')
    expect(wrapper.find('.progress-bar__value').text()).toContain('8h')
  })

  it('hides caption when showValue is false and no label', () => {
    const wrapper = mount(ProgressBar, { props: { value: 4, max: 8, showValue: false } })
    expect(wrapper.find('.progress-bar__caption').exists()).toBe(false)
  })
})
