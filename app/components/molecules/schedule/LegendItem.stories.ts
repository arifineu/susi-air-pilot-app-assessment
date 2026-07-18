import type { Meta, StoryObj } from '@storybook/vue3'
import LegendItem from './LegendItem.vue'

const meta: Meta<typeof LegendItem> = {
  title: 'Molecules/LegendItem',
  component: LegendItem,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof LegendItem>

export const OnDuty: Story = { args: { color: '#10B981', code: 'DTY', label: 'On Duty' } }
export const TravelDay: Story = { args: { color: '#FBA577', code: 'TRD', label: 'Travel Day' } }
export const Training: Story = { args: { color: '#F59E0B', code: 'TRX', label: 'Training' } }
export const Sick: Story = { args: { color: '#EF4444', code: 'SCK', label: 'Sick' } }
export const Medical: Story = { args: { color: '#7C3AED', code: 'MED', label: 'Medical' } }
