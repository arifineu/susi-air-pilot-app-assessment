import type { Meta, StoryObj } from '@storybook/vue3'
import SignInForm from './SignInForm.vue'

const meta: Meta<typeof SignInForm> = {
  title: 'Organisms/SignInForm',
  component: SignInForm,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof SignInForm>

export const Default: Story = {
  render: () => ({ components: { SignInForm }, template: '<SignInForm />' }),
}

export const Loading: Story = {
  args: { loading: true },
  render: (args) => ({
    components: { SignInForm },
    setup: () => ({ args }),
    template: '<SignInForm v-bind="args" />',
  }),
}

export const WithError: Story = {
  args: { error: 'Invalid Pilot ID or password.' },
  render: (args) => ({
    components: { SignInForm },
    setup: () => ({ args }),
    template: '<SignInForm v-bind="args" />',
  }),
}
