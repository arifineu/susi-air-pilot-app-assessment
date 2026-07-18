import type { Meta, StoryObj } from '@storybook/vue3'
import LatestNewsCarousel from './LatestNewsCarousel.vue'
import type { NewsItem } from '~/types'

const meta: Meta<typeof LatestNewsCarousel> = {
  title: 'Organisms/LatestNewsCarousel',
  component: LatestNewsCarousel,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof LatestNewsCarousel>

const items: NewsItem[] = [
  {
    id: '1',
    category: 'Operations',
    title: 'New Cessna Caravan joins the Susi Air fleet',
    excerpt: 'The 2026 Grand Caravan EX boosts capacity on Sumatra trunk routes.',
    imageUrl: 'https://picsum.photos/seed/susi-1/600/360',
    date: 'May 28, 2026',
    readTime: '3 min',
  },
  {
    id: '2',
    category: 'Safety',
    title: 'Recurrent simulator training schedule for Q3 2026',
    excerpt: 'All captains and first officers must complete the recurrent sim by 30 September.',
    imageUrl: 'https://picsum.photos/seed/susi-2/600/360',
    date: 'May 24, 2026',
    readTime: '5 min',
  },
  {
    id: '3',
    category: 'Notice',
    title: 'CRD operating hours during the Eid period',
    excerpt: 'Reduced hours from 17–21 June. See internal calendar for on-call coverage.',
    imageUrl: 'https://picsum.photos/seed/susi-3/600/360',
    date: 'May 20, 2026',
    readTime: '2 min',
  },
  {
    id: '4',
    category: 'Fleet',
    title: 'Engine overhaul programme kicks off for the PC-12 fleet',
    excerpt: 'Six airframes will rotate through the maintenance bay through August.',
    imageUrl: 'https://picsum.photos/seed/susi-4/600/360',
    date: 'May 15, 2026',
    readTime: '4 min',
  },
]

export const Default: Story = {
  args: { items },
  render: (args) => ({
    components: { LatestNewsCarousel },
    setup: () => ({ args }),
    template: '<LatestNewsCarousel v-bind="args" />',
  }),
  parameters: { layout: 'fullscreen', viewport: { defaultViewport: 'mobile1' } },
}

export const Empty: Story = {
  args: { items: [] },
  render: (args) => ({
    components: { LatestNewsCarousel },
    setup: () => ({ args }),
    template: '<LatestNewsCarousel v-bind="args" />',
  }),
}
