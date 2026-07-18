import type { Meta, StoryObj } from '@storybook/vue3'
import Icon from './Icon.vue'

const meta: Meta<typeof Icon> = {
  title: 'Atoms/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    size: { control: 'number' },
    strokeWidth: { control: { type: 'range', min: 1, max: 2.5, step: 0.25 } },
  },
}
export default meta

type Story = StoryObj<typeof Icon>

export const Plane: Story = { args: { name: 'plane', size: 24 } }
export const Calendar: Story = { args: { name: 'calendar', size: 24 } }
export const Bell: Story = { args: { name: 'bell', size: 24 } }
export const ThickStroke: Story = { args: { name: 'alert-triangle', size: 28, strokeWidth: 2 } }
export const PascalCase: Story = { args: { name: 'Clock', size: 20 } }
export const Missing: Story = { args: { name: 'not-real-icon', size: 24 } }
