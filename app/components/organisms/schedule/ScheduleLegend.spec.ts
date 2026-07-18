import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ScheduleLegend from './ScheduleLegend.vue'
import type { Legend } from '~/types'

const legend: Legend[] = [
  { code: 'DTY', label: 'On Duty', color: '#10B981' },
  { code: 'TRD', label: 'Travel Day', color: '#FBA577' },
  { code: 'SCK', label: 'Sick', color: '#EF4444' },
]

describe('ScheduleLegend', () => {
  it('renders one LegendItem per entry', () => {
    const wrapper = mount(ScheduleLegend, { props: { legend } })
    expect(wrapper.findAll('.legend-item')).toHaveLength(3)
    expect(wrapper.findAll('.legend-item__code').map((n) => n.text())).toEqual([
      'DTY',
      'TRD',
      'SCK',
    ])
  })

  it('passes the color through to each swatch', () => {
    const wrapper = mount(ScheduleLegend, { props: { legend } })
    const swatches = wrapper.findAll('.legend-item__swatch')
    expect(swatches[0]?.attributes('style')).toContain('background: #10B981')
    expect(swatches[1]?.attributes('style')).toContain('background: #FBA577')
  })

  it('drives entirely from the JSON prop — no hardcoded codes', () => {
    // If the brief's text said "TRV" but JSON says "TRD", the rendered output
    // should match JSON, never the brief's typo.
    const wrapper = mount(ScheduleLegend, { props: { legend } })
    expect(wrapper.text()).toContain('TRD')
    expect(wrapper.text()).not.toContain('TRV')
  })

  it('renders empty when legend is empty', () => {
    const wrapper = mount(ScheduleLegend, { props: { legend: [] } })
    expect(wrapper.findAll('.legend-item')).toHaveLength(0)
  })

  it('respects a custom column count', () => {
    const wrapper = mount(ScheduleLegend, { props: { legend, columns: 3 } })
    expect(wrapper.attributes('style') || '').toContain('--cols: 3')
  })
})
