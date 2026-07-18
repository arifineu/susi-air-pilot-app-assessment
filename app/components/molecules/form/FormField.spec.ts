import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FormField from './FormField.vue'

describe('FormField', () => {
  it('renders the label', () => {
    const wrapper = mount(FormField, { props: { label: 'Pilot ID' } })
    expect(wrapper.text()).toContain('Pilot ID')
  })

  it('forwards update:modelValue from inner BaseInput', async () => {
    const wrapper = mount(FormField, { props: { modelValue: '', label: 'x' } })
    await wrapper.find('input').setValue('abc')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['abc'])
  })

  it('emits action when action button clicked', async () => {
    const wrapper = mount(FormField, { props: { actionLabel: 'Forgot?' } })
    await wrapper.find('.form-field__action').trigger('click')
    expect(wrapper.emitted('action')).toHaveLength(1)
  })

  it('does not render the action button when no actionLabel', () => {
    const wrapper = mount(FormField, {})
    expect(wrapper.find('.form-field__action').exists()).toBe(false)
  })

  it('renders the hint slot when provided', () => {
    const wrapper = mount(FormField, { slots: { hint: '<span>extra</span>' } })
    expect(wrapper.find('.form-field__hint-slot').html()).toContain('extra')
  })

  it('renders error from BaseInput passthrough', () => {
    const wrapper = mount(FormField, { props: { error: 'bad' } })
    expect(wrapper.find('.base-input__error').text()).toBe('bad')
  })
})
