import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Badge from './Badge.vue'

describe('Badge', () => {
  it('applies the variant modifier class', () => {
    const wrapper = mount(Badge, { props: { variant: 'soon' } })
    expect(wrapper.classes()).toContain('badge--soon')
  })

  it('renders label prop content', () => {
    const wrapper = mount(Badge, { props: { label: 'Expired' } })
    expect(wrapper.find('.badge__label').text()).toBe('Expired')
  })

  it('renders slot over label prop', () => {
    const wrapper = mount(Badge, { props: { variant: 'safe' }, slots: { default: '11 days' } })
    expect(wrapper.find('.badge__label').text()).toBe('11 days')
  })

  it('renders the dot indicator', () => {
    const wrapper = mount(Badge, { props: { variant: 'expired' } })
    expect(wrapper.find('.badge__dot').exists()).toBe(true)
  })

  it.each<[NonNullable<InstanceType<typeof Badge>['variant']>]>([
    ['safe'],
    ['soon'],
    ['expired'],
    ['neutral'],
  ])('renders all variant: %s', (variant) => {
    const wrapper = mount(Badge, { props: { variant } })
    expect(wrapper.classes()).toContain(`badge--${variant}`)
  })
})
