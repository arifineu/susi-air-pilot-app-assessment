import type { Meta, StoryObj } from '@storybook/vue3'
import FormField from './FormField.vue'

const meta: Meta<typeof FormField> = {
  title: 'Molecules/FormField',
  component: FormField,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['text', 'email', 'password', 'tel', 'number'] },
  },
}
export default meta

type Story = StoryObj<typeof FormField>

export const Text: Story = {
  args: { label: 'Pilot ID', placeholder: 'PSA-1042', modelValue: '' },
}

export const PasswordWithAction: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: '••••••••',
    modelValue: '',
    actionLabel: 'Forgot?',
  },
}

export const WithError: Story = {
  args: { label: 'Pilot ID', modelValue: '', error: 'This field is required.' },
}

export const Disabled: Story = {
  args: { label: 'Pilot ID', modelValue: '', disabled: true },
}
