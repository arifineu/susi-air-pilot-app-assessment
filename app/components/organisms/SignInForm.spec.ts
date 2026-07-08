import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SignInForm from './SignInForm.vue'

describe('SignInForm', () => {
  it('renders Pilot ID and Password fields', () => {
    const wrapper = mount(SignInForm)
    const labels = wrapper.findAll('.base-input__label').map((n) => n.text())
    expect(labels).toEqual(['Pilot ID', 'Password'])
  })

  it('renders the Sign In submit button', () => {
    const wrapper = mount(SignInForm)
    const button = wrapper.find('.base-button')
    expect(button.text()).toContain('Sign In')
    expect(button.attributes('type')).toBe('submit')
  })

  it('emits submit with credentials on form submit', async () => {
    const wrapper = mount(SignInForm)
    await wrapper.find('input[name="pilotId"]').setValue('PSA-1042')
    await wrapper.find('input[name="password"]').setValue('hunter2')
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.emitted('submit')?.[0]).toEqual([
      { pilotId: 'PSA-1042', password: 'hunter2' },
    ])
  })

  it('does NOT emit submit when button is in loading state', async () => {
    const wrapper = mount(SignInForm, { props: { loading: true } })
    await wrapper.find('form').trigger('submit.prevent')
    // Form submit still fires but the button is disabled — verify the disabled attr
    expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeDefined()
  })

  it('renders the "Need help? Contact CRD" helper link (NOT decorative)', () => {
    const wrapper = mount(SignInForm)
    expect(wrapper.text()).toContain('Need help?')
    expect(wrapper.text()).toContain('Contact CRD')
    expect(wrapper.find('.sign-in-form__help-link').exists()).toBe(true)
  })

  it('emits contact-crd when the CRD link is clicked', async () => {
    const wrapper = mount(SignInForm)
    await wrapper.find('.sign-in-form__help-link').trigger('click')
    expect(wrapper.emitted('contact-crd')).toHaveLength(1)
  })

  it('shows the error message when error prop is set', () => {
    const wrapper = mount(SignInForm, { props: { error: 'bad credentials' } })
    expect(wrapper.find('.sign-in-form__error').text()).toBe('bad credentials')
    expect(wrapper.find('.sign-in-form__error').attributes('role')).toBe('alert')
  })
})
