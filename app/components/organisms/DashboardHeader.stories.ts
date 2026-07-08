import type { Meta, StoryObj } from '@storybook/vue3'
import DashboardHeader from './DashboardHeader.vue'

const meta: Meta<typeof DashboardHeader> = {
  title: 'Organisms/DashboardHeader',
  component: DashboardHeader,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof DashboardHeader>

export const Default: Story = {
  args: { pilotName: 'John Doe', notificationCount: 3 },
  render: (args) => ({
    components: { DashboardHeader },
    setup: () => ({ args }),
    template: '<DashboardHeader v-bind="args" />',
  }),
  parameters: { layout: 'fullscreen' },
}

export const NoNotifications: Story = {
  args: { pilotName: 'John Doe' },
  render: (args) => ({
    components: { DashboardHeader },
    setup: () => ({ args }),
    template: '<DashboardHeader v-bind="args" />',
  }),
  parameters: { layout: 'fullscreen' },
}

export const WithAvatar: Story = {
  args: {
    pilotName: 'John Doe',
    pilotAvatar: 'https://i.pravatar.cc/96?img=68',
    notificationCount: 1,
  },
  render: (args) => ({
    components: { DashboardHeader },
    setup: () => ({ args }),
    template: '<DashboardHeader v-bind="args" />',
  }),
  parameters: { layout: 'fullscreen' },
}
