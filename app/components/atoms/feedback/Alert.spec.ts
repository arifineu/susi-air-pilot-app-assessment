import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Alert from './Alert.vue'

describe('Alert', () => {
  it('applies the variant modifier class', () => {
    const wrapper = mount(Alert, { props: { variant: 'danger' } })
    expect(wrapper.classes()).toContain('alert--danger')
  })

  it('renders the title when provided', () => {
    const wrapper = mount(Alert, { props: { title: 'Heads up' } })
    expect(wrapper.find('.alert__title').text()).toBe('Heads up')
  })

  it('omits the title row when not provided', () => {
    const wrapper = mount(Alert, {})
    expect(wrapper.find('.alert__title').exists()).toBe(false)
  })

  it('renders the slot as content', () => {
    const wrapper = mount(Alert, { slots: { default: 'Need help? Call CRD.' } })
    expect(wrapper.find('.alert__content').text()).toBe('Need help? Call CRD.')
  })

  it('renders an icon matching the variant', () => {
    const info = mount(Alert, { props: { variant: 'info' } })
    const success = mount(Alert, { props: { variant: 'success' } })
    const warning = mount(Alert, { props: { variant: 'warning' } })
    const danger = mount(Alert, { props: { variant: 'danger' } })
    // Each renders one svg icon (the Lucide component)
    expect(info.findAll('svg')).toHaveLength(1)
    expect(success.findAll('svg')).toHaveLength(1)
    expect(warning.findAll('svg')).toHaveLength(1)
    expect(danger.findAll('svg')).toHaveLength(1)
  })

  it('does not render the dismiss button when dismissible=false (default)', () => {
    const wrapper = mount(Alert, {})
    expect(wrapper.find('.alert__close').exists()).toBe(false)
  })

  it('renders the dismiss button when dismissible=true', () => {
    const wrapper = mount(Alert, { props: { dismissible: true } })
    expect(wrapper.find('.alert__close').exists()).toBe(true)
    expect(wrapper.find('.alert__close').attributes('aria-label')).toBe('Dismiss')
  })

  it('emits dismiss when the close button is clicked', async () => {
    const wrapper = mount(Alert, { props: { dismissible: true } })
    await wrapper.find('.alert__close').trigger('click')
    expect(wrapper.emitted('dismiss')).toHaveLength(1)
  })

  it('has role="alert" for screen readers', () => {
    const wrapper = mount(Alert, {})
    expect(wrapper.attributes('role')).toBe('alert')
  })

  it.each<[NonNullable<InstanceType<typeof Alert>['variant']>]>([
    ['info'],
    ['success'],
    ['warning'],
    ['danger'],
  ])('renders all variant: %s', (variant) => {
    const wrapper = mount(Alert, { props: { variant } })
    expect(wrapper.classes()).toContain(`alert--${variant}`)
  })
})
