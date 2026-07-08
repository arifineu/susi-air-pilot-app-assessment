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
  args: {
    pilotName: 'John Doe',
    pilotId: 'PSA-1042',
    totalFlightHours: 1444.5,
    notificationCount: 3,
  },
  render: (args) => ({
    components: { DashboardHeader },
    setup: () => ({ args }),
    template: '<DashboardHeader v-bind="args" />',
  }),
  parameters: { layout: 'fullscreen' },
}

export const NoNotifications: Story = {
  args: { pilotName: 'John Doe', pilotId: 'PSA-1042', totalFlightHours: 1444.5 },
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
    pilotId: 'PSA-1042',
    pilotAvatar: 'https://i.pravatar.cc/96?img=68',
    totalFlightHours: 1444.5,
    notificationCount: 1,
  },
  render: (args) => ({
    components: { DashboardHeader },
    setup: () => ({ args }),
    template: '<DashboardHeader v-bind="args" />',
  }),
  parameters: { layout: 'fullscreen' },
}

export const WholeNumberHours: Story = {
  args: { pilotName: 'Susi Susanti', pilotId: 'PSA-2204', totalFlightHours: 2200 },
  render: (args) => ({
    components: { DashboardHeader },
    setup: () => ({ args }),
    template: '<DashboardHeader v-bind="args" />',
  }),
  parameters: { layout: 'fullscreen' },
}

export const NoHoursStat: Story = {
  args: { pilotName: 'New Pilot', pilotId: 'PSA-9999' },
  render: (args) => ({
    components: { DashboardHeader },
    setup: () => ({ args }),
    template: '<DashboardHeader v-bind="args" />',
  }),
  parameters: { layout: 'fullscreen' },
}
