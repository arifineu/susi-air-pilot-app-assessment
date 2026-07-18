import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LatestNewsCarousel from './LatestNewsCarousel.vue'
import type { NewsItem } from '~/types'

const items: NewsItem[] = [
  { id: '1', title: 'First', category: 'Ops', date: 'May 1' },
  { id: '2', title: 'Second', category: 'Safety', date: 'May 2' },
  { id: '3', title: 'Third', date: 'May 3' },
]

describe('LatestNewsCarousel', () => {
  it('renders the title', () => {
    const wrapper = mount(LatestNewsCarousel, { props: { items } })
    expect(wrapper.find('.latest-news-carousel__title').text()).toBe('Latest News')
  })

  it('renders one NewsCard per item', () => {
    const wrapper = mount(LatestNewsCarousel, { props: { items } })
    expect(wrapper.findAll('.news-card')).toHaveLength(3)
  })

  it('renders a custom title when provided', () => {
    const wrapper = mount(LatestNewsCarousel, { props: { items, title: 'Announcements' } })
    expect(wrapper.find('.latest-news-carousel__title').text()).toBe('Announcements')
  })

  it('emits select with the item id when a card is clicked', async () => {
    const wrapper = mount(LatestNewsCarousel, { props: { items } })
    await wrapper.findAll('.news-card')[0]?.trigger('click')
    expect(wrapper.emitted('select')?.[0]).toEqual(['1'])
  })

  it('renders the scroll container with region role + aria-label', () => {
    const wrapper = mount(LatestNewsCarousel, { props: { items } })
    const scroll = wrapper.find('.latest-news-carousel__scroll')
    expect(scroll.attributes('role')).toBe('region')
    expect(scroll.attributes('aria-label')).toBe('Latest News')
    expect(scroll.attributes('tabindex')).toBe('0')
  })

  it('renders empty when no items', () => {
    const wrapper = mount(LatestNewsCarousel, { props: { items: [] } })
    expect(wrapper.findAll('.news-card')).toHaveLength(0)
  })
})
