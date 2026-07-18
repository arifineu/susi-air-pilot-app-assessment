import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Skeleton from './Skeleton.vue'

describe('Skeleton', () => {
  it('applies the variant modifier class', () => {
    const wrapper = mount(Skeleton, { props: { variant: 'text' } })
    expect(wrapper.classes()).toContain('skeleton--text')
  })

  it('defaults to rect variant', () => {
    const wrapper = mount(Skeleton)
    expect(wrapper.classes()).toContain('skeleton--rect')
  })

  it('renders aria-hidden for screen readers', () => {
    const wrapper = mount(Skeleton)
    expect(wrapper.attributes('aria-hidden')).toBe('true')
  })

  it('passes numeric width/height through as px', () => {
    const wrapper = mount(Skeleton, { props: { width: 100, height: 50 } })
    expect(wrapper.attributes('style')).toContain('width: 100px')
    expect(wrapper.attributes('style')).toContain('height: 50px')
  })

  it('passes string width/height through unchanged', () => {
    const wrapper = mount(Skeleton, { props: { width: '80%', height: '2rem' } })
    expect(wrapper.attributes('style')).toContain('width: 80%')
    expect(wrapper.attributes('style')).toContain('height: 2rem')
  })

  it('honours custom radius', () => {
    const wrapper = mount(Skeleton, { props: { radius: 4 } })
    expect(wrapper.attributes('style')).toContain('border-radius: 4px')
  })

  it.each<[NonNullable<InstanceType<typeof Skeleton>['variant']>]>([
    ['text'],
    ['rect'],
    ['circle'],
  ])('renders all variant: %s', (variant) => {
    const wrapper = mount(Skeleton, { props: { variant } })
    expect(wrapper.classes()).toContain(`skeleton--${variant}`)
  })
})
