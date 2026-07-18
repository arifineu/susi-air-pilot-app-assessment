import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BrandLogo from './BrandLogo.vue'

describe('BrandLogo', () => {
  it('renders an img pointing at the real asset', () => {
    const wrapper = mount(BrandLogo)
    expect(wrapper.find('img').exists()).toBe(true)
    expect(wrapper.find('img').attributes('src')).toBe('/susi-air-logo.png')
  })

  it('uses the Susi Air alt text', () => {
    const wrapper = mount(BrandLogo)
    expect(wrapper.find('img').attributes('alt')).toBe('Susi Air')
  })

  it('applies the requested height as inline style', () => {
    const wrapper = mount(BrandLogo, { props: { height: 36 } })
    expect(wrapper.find('img').attributes('style')).toContain('height: 36px')
  })

  it('applies the variant modifier class', () => {
    const wrapper = mount(BrandLogo, { props: { variant: 'mark' } })
    expect(wrapper.classes()).toContain('brand-logo--mark')
  })
})
