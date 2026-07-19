import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LimitCard from './LimitCard.vue'

describe('LimitCard', () => {
  it('renders the label (Daily / Weekly / Monthly / Annual)', () => {
    const wrapper = mount(LimitCard, { props: { label: 'Daily', value: 3, limit: 8 } })
    expect(wrapper.find('.limit-card__label').text()).toBe('Daily')
  })

  it('renders a ProgressBar (not a ProgressRing)', () => {
    const wrapper = mount(LimitCard, { props: { label: 'Daily', value: 3, limit: 8 } })
    expect(wrapper.find('.progress-bar').exists()).toBe(true)
    expect(wrapper.find('.progress-ring').exists()).toBe(false)
  })

  it('formats value/limit as "4.3 / 8h" (unit on the limit side only)', () => {
    const wrapper = mount(LimitCard, { props: { label: 'Daily', value: 4.3, limit: 8 } })
    const value = wrapper.find('.limit-card__value')
    expect(value.text()).toBe('4.3 / 8h')
    expect(wrapper.find('.limit-card__value-current').text()).toBe('4.3')
    expect(wrapper.find('.limit-card__value-limit').text()).toBe('8h')
  })

  it('formats larger limits correctly ("1025.3 / 1050h")', () => {
    const wrapper = mount(LimitCard, {
      props: { label: 'Annual', value: 1025.3, limit: 1050 },
    })
    expect(wrapper.find('.limit-card__value').text()).toBe('1025.3 / 1050h')
  })

  it('strips trailing .0 for whole-hour values ("8 / 8h", not "8.0 / 8h")', () => {
    const wrapper = mount(LimitCard, { props: { label: 'Daily', value: 8, limit: 8 } })
    expect(wrapper.find('.limit-card__value-current').text()).toBe('8')
  })

  it('rounds IEEE-754 noise (24.599999...) to "24.6"', () => {
    const wrapper = mount(LimitCard, {
      props: { label: 'Monthly', value: 24.599999999, limit: 100 },
    })
    expect(wrapper.find('.limit-card__value-current').text()).toBe('24.6')
  })

  it('shows remaining = limit - value', () => {
    const wrapper = mount(LimitCard, { props: { label: 'Daily', value: 3, limit: 8, unit: 'h' } })
    expect(wrapper.find('.limit-card__remaining-value').text()).toBe('5h')
  })

  it('clamps remaining at 0 when value exceeds limit', () => {
    const wrapper = mount(LimitCard, { props: { label: 'Daily', value: 10, limit: 8 } })
    expect(wrapper.find('.limit-card__remaining-value').text()).toBe('0h')
  })

  it('switches remaining to minutes when under 1h ("42m", not "0.7h")', () => {
    const wrapper = mount(LimitCard, { props: { label: 'Daily', value: 7.3, limit: 8 } })
    // 8 - 7.3 = 0.7h → 42m
    expect(wrapper.find('.limit-card__remaining-value').text()).toBe('42m')
  })

  it('does not render the old "of <limit>" subtitle line', () => {
    const wrapper = mount(LimitCard, { props: { label: 'Weekly', value: 28, limit: 40 } })
    expect(wrapper.find('.limit-card__limit').exists()).toBe(false)
  })

  it('applies warning state at >= 80%', () => {
    const wrapper = mount(LimitCard, { props: { label: 'Daily', value: 7, limit: 8 } })
    expect(wrapper.classes()).toContain('limit-card--warning')
  })

  it('applies danger state at >= 100%', () => {
    const wrapper = mount(LimitCard, { props: { label: 'Daily', value: 8, limit: 8 } })
    expect(wrapper.classes()).toContain('limit-card--danger')
  })
})
