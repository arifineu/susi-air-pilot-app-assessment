import type { Meta, StoryObj } from '@storybook/vue3'
import BaseInput from './BaseInput.vue'

const meta: Meta<typeof BaseInput> = {
  title: 'Atoms/BaseInput',
  component: BaseInput,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['text', 'email', 'password', 'tel', 'number'] },
  },
}
export default meta

type Story = StoryObj<typeof BaseInput>

export const Text: Story = {
  args: { label: 'Pilot ID', placeholder: 'e.g. PSA-1042', modelValue: '' },
}

export const Password: Story = {
  args: { label: 'Password', type: 'password', placeholder: '••••••••', modelValue: '' },
}

export const Email: Story = {
  args: { label: 'Email', type: 'email', placeholder: 'you@susiair.com', modelValue: '' },
}

export const WithError: Story = {
  args: { label: 'Pilot ID', placeholder: 'Pilot ID', modelValue: '', error: 'Pilot ID is required.' },
}

export const WithHint: Story = {
  args: {
    label: 'Pilot ID',
    placeholder: 'Pilot ID',
    modelValue: '',
    hint: 'Use the format PSA-####.',
  },
}

export const Disabled: Story = {
  args: { label: 'Pilot ID', placeholder: 'Pilot ID', modelValue: '', disabled: true },
}
