import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Chip from './Chip.vue'

type NonVariant = 'default' | 'accent' | 'success' | 'warning' | 'danger'

describe('Chip', () => {
  it('renders slot content', () => {
    const wrapper = mount(Chip, { slots: { default: 'Cessna' } })
    expect(wrapper.find('.chip__label').text()).toBe('Cessna')
  })

  it('shows dismiss button only when dismissable', () => {
    const without = mount(Chip, { slots: { default: 'x' } })
    expect(without.find('.chip__dismiss').exists()).toBe(false)
    const withBtn = mount(Chip, { props: { dismissable: true }, slots: { default: 'x' } })
    expect(withBtn.find('.chip__dismiss').exists()).toBe(true)
  })

  it('emits dismiss on click', async () => {
    const wrapper = mount(Chip, { props: { dismissable: true }, slots: { default: 'x' } })
    await wrapper.find('.chip__dismiss').trigger('click')
    expect(wrapper.emitted('dismiss')).toHaveLength(1)
  })

  it('applies selected modifier', () => {
    const wrapper = mount(Chip, { props: { selected: true }, slots: { default: 'On Duty' } })
    expect(wrapper.classes()).toContain('chip--selected')
  })

  it('defaults to the neutral `chip--default` variant', () => {
    const wrapper = mount(Chip, { slots: { default: 'x' } })
    expect(wrapper.classes()).toContain('chip--default')
  })

  it.each<[NonVariant]>([
    ['accent'],
    ['success'],
    ['warning'],
    ['danger'],
  ])('applies the `%s` variant class', (variant) => {
    const wrapper = mount(Chip, { props: { variant }, slots: { default: 'x' } })
    expect(wrapper.classes()).toContain(`chip--${variant}`)
  })
})
