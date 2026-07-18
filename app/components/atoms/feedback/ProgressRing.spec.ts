import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProgressRing from './ProgressRing.vue'

describe('ProgressRing', () => {
  it('renders two circles (track + value)', () => {
    const wrapper = mount(ProgressRing, { props: { value: 4, max: 8 } })
    expect(wrapper.findAll('circle')).toHaveLength(2)
  })

  it('clamps negative and overflowing values into 0..max', () => {
    const over = mount(ProgressRing, { props: { value: 12, max: 8 } })
    const under = mount(ProgressRing, { props: { value: -3, max: 8 } })
    // dashoffset for clamped=8 (max) → ratio=1 → offset = circumference * 0
    expect(over.find('.progress-ring__value').attributes('stroke-dashoffset')).toBe('0')
    // clamped=0 → ratio=0 → offset = circumference (full gap)
    const neg = under.find('.progress-ring__value').attributes('stroke-dashoffset')
    expect(Number(neg)).toBeGreaterThan(0)
  })

  it('applies safe state when value < 80%', () => {
    const wrapper = mount(ProgressRing, { props: { value: 4, max: 8 } })
    // 4/8 = 0.5 → safe
    expect(wrapper.classes()).toContain('progress-ring--safe')
  })

  it('applies warning state at >= 80%', () => {
    const wrapper = mount(ProgressRing, { props: { value: 7, max: 8 } })
    expect(wrapper.classes()).toContain('progress-ring--warning')
  })

  it('applies danger state at >= 100%', () => {
    const wrapper = mount(ProgressRing, { props: { value: 8, max: 8 } })
    expect(wrapper.classes()).toContain('progress-ring--danger')
  })

  it('shows the value and unit in the center', () => {
    const wrapper = mount(ProgressRing, { props: { value: 4, max: 8, unit: 'h', label: 'Daily' } })
    expect(wrapper.find('.progress-ring__value-text').text()).toContain('4')
    expect(wrapper.find('.progress-ring__unit').text()).toBe('h')
    expect(wrapper.find('.progress-ring__label').text()).toBe('Daily')
  })

  it('honours custom thresholds', () => {
    const wrapper = mount(ProgressRing, {
      props: { value: 50, max: 100, warningThreshold: 0.5, dangerThreshold: 0.9 },
    })
    expect(wrapper.classes()).toContain('progress-ring--warning')
  })
})
