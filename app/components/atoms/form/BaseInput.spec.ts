import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseInput from './BaseInput.vue'

describe('BaseInput', () => {
  it('renders the label', () => {
    const wrapper = mount(BaseInput, { props: { label: 'Pilot ID' } })
    expect(wrapper.text()).toContain('Pilot ID')
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(BaseInput, { props: { modelValue: '' } })
    await wrapper.find('input').setValue('hello')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['hello'])
  })

  it('applies the error modifier when error prop is set', () => {
    const wrapper = mount(BaseInput, { props: { error: 'bad' } })
    expect(wrapper.classes()).toContain('base-input--error')
    expect(wrapper.find('.base-input__error').text()).toBe('bad')
  })

  it('renders hint when no error present', () => {
    const wrapper = mount(BaseInput, { props: { hint: 'use PSA-####' } })
    expect(wrapper.find('.base-input__hint').text()).toBe('use PSA-####')
  })

  it('hides hint when error is shown', () => {
    const wrapper = mount(BaseInput, { props: { hint: 'h', error: 'e' } })
    expect(wrapper.find('.base-input__hint').exists()).toBe(false)
    expect(wrapper.find('.base-input__error').exists()).toBe(true)
  })

  it('toggles password visibility', async () => {
    const wrapper = mount(BaseInput, { props: { type: 'password' } })
    expect(wrapper.find('input').attributes('type')).toBe('password')
    await wrapper.find('.base-input__reveal').trigger('click')
    expect(wrapper.find('input').attributes('type')).toBe('text')
  })

  it('does not render the reveal button for non-password types', () => {
    const wrapper = mount(BaseInput, { props: { type: 'text' } })
    expect(wrapper.find('.base-input__reveal').exists()).toBe(false)
  })

  it('forwards the placeholder attribute', () => {
    const wrapper = mount(BaseInput, { props: { placeholder: 'abc' } })
    expect(wrapper.find('input').attributes('placeholder')).toBe('abc')
  })

  it('disables the input when disabled prop is true', () => {
    const wrapper = mount(BaseInput, { props: { disabled: true } })
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })
})
