import type { Meta, StoryObj } from '@storybook/vue3'
import BaseButton from './BaseButton.vue'

const meta: Meta<typeof BaseButton> = {
  title: 'Atoms/BaseButton',
  component: BaseButton,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    type: { control: 'select', options: ['button', 'submit', 'reset'] },
  },
}
export default meta

type Story = StoryObj<typeof BaseButton>

export const Primary: Story = { args: { variant: 'primary', default: 'Sign In' } }
export const Secondary: Story = { args: { variant: 'secondary', default: 'Cancel' } }
export const Ghost: Story = { args: { variant: 'ghost', default: 'Forgot password?' } }
export const Danger: Story = { args: { variant: 'danger', default: 'Delete' } }
export const Disabled: Story = { args: { variant: 'primary', default: 'Sign In', disabled: true } }
export const Loading: Story = { args: { variant: 'primary', default: 'Signing in', loading: true } }
export const Small: Story = { args: { variant: 'secondary', size: 'sm', default: 'Filter' } }
export const Large: Story = { args: { variant: 'primary', size: 'lg', default: 'Continue', fullWidth: true } }
