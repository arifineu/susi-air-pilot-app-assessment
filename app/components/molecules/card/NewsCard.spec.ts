import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NewsCard from './NewsCard.vue'

describe('NewsCard', () => {
  it('renders the title', () => {
    const wrapper = mount(NewsCard, { props: { title: 'Hello world' } })
    expect(wrapper.find('.news-card__title').text()).toBe('Hello world')
  })

  it('renders the category chip when provided', () => {
    const wrapper = mount(NewsCard, { props: { title: 't', category: 'Ops' } })
    expect(wrapper.find('.news-card__category').text()).toBe('Ops')
  })

  it('omits the chip when no category', () => {
    const wrapper = mount(NewsCard, { props: { title: 't' } })
    expect(wrapper.find('.news-card__category').exists()).toBe(false)
  })

  it('renders the excerpt', () => {
    const wrapper = mount(NewsCard, { props: { title: 't', excerpt: 'Body text' } })
    expect(wrapper.find('.news-card__excerpt').text()).toBe('Body text')
  })

  it('renders the media block when imageUrl is set', () => {
    const wrapper = mount(NewsCard, { props: { title: 't', imageUrl: 'a.jpg' } })
    expect(wrapper.find('.news-card__media').exists()).toBe(true)
    expect(wrapper.find('img').attributes('src')).toBe('a.jpg')
  })

  it('emits click on card click', async () => {
    const wrapper = mount(NewsCard, { props: { title: 't' } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('renders meta line when date or readTime given', () => {
    const wrapper = mount(NewsCard, {
      props: { title: 't', date: 'May 1', readTime: '2 min' },
    })
    expect(wrapper.find('.news-card__meta').text()).toContain('May 1')
    expect(wrapper.find('.news-card__meta').text()).toContain('2 min')
  })
})
