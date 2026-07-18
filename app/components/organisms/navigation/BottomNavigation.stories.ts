import type { Meta, StoryObj } from '@storybook/vue3'
import BottomNavigation from './BottomNavigation.vue'
import type { NavItem } from '~/types'

const meta: Meta<typeof BottomNavigation> = {
  title: 'Organisms/BottomNavigation',
  component: BottomNavigation,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof BottomNavigation>

const items: NavItem[] = [
  { label: 'Home', icon: 'home', to: '/home' },
  { label: 'Schedule', icon: 'calendar', to: '/schedule' },
  { label: 'Logbook', icon: 'book', to: '/logbook', badge: 3 },
  { label: 'More', icon: 'more-horizontal', to: '/more' },
]

export const HomeActive: Story = {
  args: { items, activeRoute: '/home' },
  render: (args) => ({
    components: { BottomNavigation },
    setup: () => ({ args }),
    template: '<BottomNavigation v-bind="args" />',
  }),
  parameters: { layout: 'fullscreen' },
}

export const ScheduleActive: Story = {
  args: { items, activeRoute: '/schedule' },
  render: (args) => ({
    components: { BottomNavigation },
    setup: () => ({ args }),
    template: '<BottomNavigation v-bind="args" />',
  }),
  parameters: { layout: 'fullscreen' },
}

export const WithBadge: Story = {
  args: { items, activeRoute: '/logbook' },
  render: (args) => ({
    components: { BottomNavigation },
    setup: () => ({ args }),
    template: '<BottomNavigation v-bind="args" />',
  }),
  parameters: { layout: 'fullscreen' },
}
