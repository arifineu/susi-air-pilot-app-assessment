import type { Meta, StoryObj } from '@storybook/vue3'
import ProgressBar from './ProgressBar.vue'

const meta: Meta<typeof ProgressBar> = {
  title: 'Atoms/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof ProgressBar>

export const Safe: Story = { args: { value: 4, max: 8, unit: 'h', label: 'Daily' } }
export const Warning: Story = { args: { value: 33, max: 40, unit: 'h', label: 'Weekly' } }
export const Danger: Story = { args: { value: 100, max: 100, unit: 'h', label: 'Monthly' } }
export const Bare: Story = { args: { value: 45, max: 100, showValue: false }, render: (a) => ({
  components: { ProgressBar },
  setup: () => ({ a }),
  template: '<ProgressBar v-bind="a" />',
}) }
export const Tall: Story = { args: { value: 60, max: 100, height: 12, showValue: false }, render: (a) => ({
  components: { ProgressBar },
  setup: () => ({ a }),
  template: '<ProgressBar v-bind="a" />',
}) }
