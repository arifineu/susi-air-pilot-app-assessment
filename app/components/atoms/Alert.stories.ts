import type { Meta, StoryObj } from '@storybook/vue3'
import Alert from './Alert.vue'

const meta: Meta<typeof Alert> = {
  title: 'Atoms/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['info', 'success', 'warning', 'danger'] },
  },
}
export default meta

type Story = StoryObj<typeof Alert>

export const Info: Story = {
  args: { variant: 'info', title: 'Heads up', dismissible: true },
  render: (args) => ({
    components: { Alert },
    setup: () => ({ args }),
    template: '<Alert v-bind="args">Need help? Contact CRD at <strong>+62 21 5590 0010</strong> (24/7).</Alert>',
  }),
}

export const Success: Story = {
  args: { variant: 'success', title: 'Saved' },
  render: (args) => ({
    components: { Alert },
    setup: () => ({ args }),
    template: '<Alert v-bind="args">Your profile changes have been saved.</Alert>',
  }),
}

export const Warning: Story = {
  args: { variant: 'warning', title: 'Approaching limit' },
  render: (args) => ({
    components: { Alert },
    setup: () => ({ args }),
    template: '<Alert v-bind="args">You\'re within 2 hours of the daily flight-time limit.</Alert>',
  }),
}

export const Danger: Story = {
  args: { variant: 'danger', title: 'License expired' },
  render: (args) => ({
    components: { Alert },
    setup: () => ({ args }),
    template: '<Alert v-bind="args">Your Indonesian License expired <strong>2 days ago</strong>. Contact CRD before your next duty.</Alert>',
  }),
}

export const Dismissible: Story = {
  args: { variant: 'info', dismissible: true },
  render: (args) => ({
    components: { Alert },
    setup: () => ({ args }),
    template: '<Alert v-bind="args">This alert emits a <strong>dismiss</strong> event when the X is clicked.</Alert>',
  }),
}

export const NoTitle: Story = {
  args: { variant: 'info' },
  render: (args) => ({
    components: { Alert },
    setup: () => ({ args }),
    template: '<Alert v-bind="args">A minimal alert with body content only — no title row.</Alert>',
  }),
}
