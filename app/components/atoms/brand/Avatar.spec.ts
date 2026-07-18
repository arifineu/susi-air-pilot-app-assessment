import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Avatar from './Avatar.vue'

describe('Avatar', () => {
  it('renders the image when src is provided', () => {
    const wrapper = mount(Avatar, { props: { src: 'a.jpg', alt: 'me' } })
    expect(wrapper.find('.avatar__img').exists()).toBe(true)
    expect(wrapper.find('.avatar__img').attributes('src')).toBe('a.jpg')
  })

  it('shows initials fallback when no src', () => {
    const wrapper = mount(Avatar, { props: { name: 'John Doe' } })
    expect(wrapper.find('.avatar__img').exists()).toBe(false)
    expect(wrapper.find('.avatar__fallback').text()).toBe('JD')
  })

  it('handles single-name gracefully', () => {
    const wrapper = mount(Avatar, { props: { name: 'Susi' } })
    expect(wrapper.find('.avatar__fallback').text()).toBe('S')
  })

  it('falls back when image fails to load', async () => {
    const wrapper = mount(Avatar, { props: { src: 'bad.jpg', name: 'John Doe' } })
    await wrapper.find('img').trigger('error')
    expect(wrapper.find('.avatar__img').exists()).toBe(false)
    expect(wrapper.find('.avatar__fallback').text()).toBe('JD')
  })

  it('applies size modifier', () => {
    const wrapper = mount(Avatar, { props: { size: 'lg', name: 'A B' } })
    expect(wrapper.classes()).toContain('avatar--lg')
  })

  it('renders "?" when no name and no src', () => {
    const wrapper = mount(Avatar, {})
    expect(wrapper.find('.avatar__fallback').text()).toBe('?')
  })
})
