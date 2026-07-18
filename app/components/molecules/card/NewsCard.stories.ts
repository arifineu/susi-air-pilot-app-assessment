import type { Meta, StoryObj } from '@storybook/vue3'
import NewsCard from './NewsCard.vue'

const meta: Meta<typeof NewsCard> = {
  title: 'Molecules/NewsCard',
  component: NewsCard,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof NewsCard>

export const Default: Story = {
  args: {
    category: 'Operations',
    title: 'New Cessna Caravan joins the Susi Air fleet',
    excerpt: 'The 2026 Grand Caravan EX boosts capacity on the Sumatra trunk routes.',
    imageUrl: 'https://picsum.photos/seed/susi-news-1/600/360',
    date: 'May 28, 2026',
    readTime: '3 min',
  },
}

export const WithoutImage: Story = {
  args: {
    category: 'Notice',
    title: 'CRD operating hours during Eid period',
    date: 'May 24, 2026',
  },
}

export const LongTitle: Story = {
  args: {
    category: 'Safety',
    title: 'Recurrent simulator training schedule for Q3 2026 — important update for all captains and first officers',
    excerpt: 'Brief excerpt.',
    imageUrl: 'https://picsum.photos/seed/susi-news-2/600/360',
    date: 'May 20, 2026',
    readTime: '5 min',
  },
}
