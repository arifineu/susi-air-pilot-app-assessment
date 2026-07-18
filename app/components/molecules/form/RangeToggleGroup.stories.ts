import type { Meta, StoryObj } from '@storybook/vue3'
import RangeToggleGroup from './RangeToggleGroup.vue'

const meta: Meta<typeof RangeToggleGroup> = {
  title: 'Molecules/RangeToggleGroup',
  component: RangeToggleGroup,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof RangeToggleGroup>

export const Default1w: Story = { args: { modelValue: '1w' } }
export const Active3m: Story = { args: { modelValue: '3m' } }
export const Active1y: Story = { args: { modelValue: '1y' } }

export const Custom: Story = {
  args: {
    modelValue: '24h',
    options: [
      { value: '24h', label: '24H' },
      { value: '7d', label: '7D' },
      { value: '30d', label: '30D' },
    ],
  },
}
