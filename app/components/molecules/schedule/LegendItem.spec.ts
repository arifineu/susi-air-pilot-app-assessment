import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LegendItem from './LegendItem.vue'

describe('LegendItem', () => {
  it('renders the code and label', () => {
    const wrapper = mount(LegendItem, { props: { color: '#10B981', code: 'DTY', label: 'On Duty' } })
    expect(wrapper.find('.legend-item__code').text()).toBe('DTY')
    expect(wrapper.find('.legend-item__label').text()).toBe('On Duty')
  })

  it('applies the color to the swatch via inline style', () => {
    const wrapper = mount(LegendItem, { props: { color: '#FBA577', code: 'TRD', label: 'Travel Day' } })
    expect(wrapper.find('.legend-item__swatch').attributes('style')).toContain('background: #FBA577')
  })

  it('exposes the color in aria-label', () => {
    const wrapper = mount(LegendItem, { props: { color: '#fff', code: 'X', label: 'Y' } })
    expect(wrapper.find('.legend-item__swatch').attributes('aria-label')).toContain('X')
  })
})
