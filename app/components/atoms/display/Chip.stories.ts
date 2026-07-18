import type { Meta, StoryObj } from '@storybook/vue3'
import Chip from './Chip.vue'

const meta: Meta<typeof Chip> = {
  title: 'Atoms/Chip',
  component: Chip,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof Chip>

export const Default: Story = { render: () => ({ components: { Chip }, template: '<Chip>Scheduled</Chip>' }) }
export const Selected: Story = { render: () => ({ components: { Chip }, template: '<Chip selected>On Duty</Chip>' }) }
export const Dismissable: Story = { render: () => ({ components: { Chip }, template: '<Chip dismissable>Cessna</Chip>' }) }
