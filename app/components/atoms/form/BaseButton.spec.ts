import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from './BaseButton.vue'

describe('BaseButton', () => {
  it('renders slot content as label', () => {
    const wrapper = mount(BaseButton, { slots: { default: 'Sign In' } })
    expect(wrapper.text()).toContain('Sign In')
  })

  it('applies the variant modifier class', () => {
    const wrapper = mount(BaseButton, { props: { variant: 'danger' } })
    expect(wrapper.classes()).toContain('base-button--danger')
  })

  it('applies the size modifier class', () => {
    const wrapper = mount(BaseButton, { props: { size: 'lg' } })
    expect(wrapper.classes()).toContain('base-button--lg')
  })

  it('emits click when enabled', async () => {
    const wrapper = mount(BaseButton)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('does NOT emit click when disabled', async () => {
    const wrapper = mount(BaseButton, { props: { disabled: true } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('does NOT emit click when loading', async () => {
    const wrapper = mount(BaseButton, { props: { loading: true } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('shows the spinner instead of label-icon when loading', () => {
    const wrapper = mount(BaseButton, { props: { loading: true }, slots: { default: 'Saving' } })
    expect(wrapper.find('.base-button__spinner').exists()).toBe(true)
    // native disabled flag also set so form submit is blocked
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('renders the icon slot when provided and not loading', () => {
    const wrapper = mount(BaseButton, {
      slots: { default: 'Add', icon: '<svg class="i" />' },
    })
    expect(wrapper.find('.base-button__icon').exists()).toBe(true)
  })

  it('forwards the type attribute', () => {
    const wrapper = mount(BaseButton, { props: { type: 'submit' } })
    expect(wrapper.attributes('type')).toBe('submit')
  })
})
