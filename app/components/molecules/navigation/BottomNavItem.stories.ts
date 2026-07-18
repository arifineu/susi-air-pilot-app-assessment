import type { Meta, StoryObj } from '@storybook/vue3'
import BottomNavItem from './BottomNavItem.vue'

const meta: Meta<typeof BottomNavItem> = {
  title: 'Molecules/BottomNavItem',
  component: BottomNavItem,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof BottomNavItem>

export const Inactive: Story = { args: { label: 'Schedule', icon: 'calendar' } }
export const Active: Story = { args: { label: 'Home', icon: 'home', active: true } }
export const WithBadge: Story = { args: { label: 'Logbook', icon: 'book', badge: 3 } }
export const ActiveWithBadge: Story = { args: { label: 'More', icon: 'more-horizontal', active: true, badge: 12 } }
