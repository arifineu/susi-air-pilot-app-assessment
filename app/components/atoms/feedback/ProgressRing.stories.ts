import type { Meta, StoryObj } from '@storybook/vue3'
import ProgressRing from './ProgressRing.vue'

const meta: Meta<typeof ProgressRing> = {
  title: 'Atoms/ProgressRing',
  component: ProgressRing,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof ProgressRing>

export const Safe: Story = { args: { value: 4, max: 8, unit: 'h', label: 'Daily' } }
export const Warning: Story = { args: { value: 7, max: 8, unit: 'h', label: 'Daily' } }
export const Danger: Story = { args: { value: 8, max: 8, unit: 'h', label: 'Daily' } }
export const Zero: Story = { args: { value: 0, max: 8, unit: 'h', label: 'Daily' } }
export const OvershootsIsClamped: Story = { args: { value: 12, max: 8, unit: 'h', label: 'Daily' } }
export const Weekly100h: Story = { args: { value: 64, max: 100, unit: 'h', label: 'Monthly' } }
