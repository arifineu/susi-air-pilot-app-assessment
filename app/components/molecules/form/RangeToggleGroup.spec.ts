import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RangeToggleGroup from './RangeToggleGroup.vue'

describe('RangeToggleGroup', () => {
  it('renders the default 5 options', () => {
    const wrapper = mount(RangeToggleGroup, { props: { modelValue: '1w' } })
    const labels = wrapper.findAll('.range-toggle-group__option').map((b) => b.text())
    expect(labels).toEqual(['1W', '1M', '3M', '6M', '1Y'])
  })

  it('marks the active option', () => {
    const wrapper = mount(RangeToggleGroup, { props: { modelValue: '3m' } })
    const active = wrapper.findAll('.range-toggle-group__option--active')
    expect(active).toHaveLength(1)
    expect(active[0]?.text()).toBe('3M')
    expect(active[0]?.attributes('aria-selected')).toBe('true')
  })

  it('emits update:modelValue on click of a different option', async () => {
    const wrapper = mount(RangeToggleGroup, { props: { modelValue: '1w' } })
    const buttons = wrapper.findAll('.range-toggle-group__option')
    await buttons[2]?.trigger('click') // 3M
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['3m'])
  })

  it('does NOT emit when the active option is clicked again', async () => {
    const wrapper = mount(RangeToggleGroup, { props: { modelValue: '1w' } })
    await wrapper.findAll('.range-toggle-group__option')[0]?.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('honours custom options', () => {
    const wrapper = mount(RangeToggleGroup, {
      props: {
        modelValue: '24h',
        options: [
          { value: '24h', label: '24H' },
          { value: '7d', label: '7D' },
        ],
      },
    })
    expect(wrapper.findAll('.range-toggle-group__option').map((b) => b.text())).toEqual(['24H', '7D'])
  })
})
