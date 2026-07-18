import type { Meta, StoryObj } from '@storybook/vue3'
import BrandLogo from './BrandLogo.vue'

const meta: Meta<typeof BrandLogo> = {
  title: 'Atoms/BrandLogo',
  component: BrandLogo,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof BrandLogo>

export const Default: Story = { args: { height: 28 } }
export const Small: Story = { args: { height: 20 } }
export const Large: Story = { args: { height: 40 } }
