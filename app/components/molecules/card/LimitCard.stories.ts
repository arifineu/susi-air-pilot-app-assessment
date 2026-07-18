import type { Meta, StoryObj } from '@storybook/vue3'
import LimitCard from './LimitCard.vue'

const meta: Meta<typeof LimitCard> = {
  title: 'Molecules/LimitCard',
  component: LimitCard,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof LimitCard>

export const DailySafe: Story = { args: { label: 'Daily', value: 3.2, limit: 8, unit: 'h' } }
export const DailyWarning: Story = { args: { label: 'Daily', value: 6.8, limit: 8, unit: 'h' } }
export const DailyDanger: Story = { args: { label: 'Daily', value: 8, limit: 8, unit: 'h' } }
export const Weekly: Story = { args: { label: 'Weekly', value: 28, limit: 40, unit: 'h' } }
export const Monthly: Story = { args: { label: 'Monthly', value: 88, limit: 100, unit: 'h' } }
export const Annual: Story = { args: { label: 'Annual', value: 920, limit: 1050, unit: 'h' } }
