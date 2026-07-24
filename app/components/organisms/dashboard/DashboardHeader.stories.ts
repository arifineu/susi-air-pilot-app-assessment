import type { Meta, StoryObj } from '@storybook/vue3'
import DashboardHeader from './DashboardHeader.vue'
import type { NotificationItem } from '~/types'

const meta: Meta<typeof DashboardHeader> = {
  title: 'Organisms/DashboardHeader',
  component: DashboardHeader,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof DashboardHeader>

const sampleNotifications: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Duty starts in 2 hours',
    body: 'PDG → PLM, ATR 72-600. Report by 14:30 LT.',
    time: '12m ago',
    variant: 'info',
  },
  {
    id: 'n2',
    title: 'Schedule change',
    body: 'PKU → BTH leg added to tomorrow\'s roster.',
    time: '1h ago',
    variant: 'warning',
  },
  {
    id: 'n3',
    title: 'Medical certificate expires soon',
    body: '14 days remaining — renew before 22 July 2026.',
    time: 'Yesterday',
    variant: 'warning',
  },
]

export const Default: Story = {
  args: {
    pilotName: 'John Doe',
    pilotId: 'PSA-1042',
    totalFlightHours: 1444.5,
    notifications: sampleNotifications,
  },
  render: (args) => ({
    components: { DashboardHeader },
    setup: () => ({ args }),
    template: '<DashboardHeader v-bind="args" />',
  }),
  parameters: { layout: 'fullscreen' },
}

export const NoNotifications: Story = {
  args: { pilotName: 'John Doe', pilotId: 'PSA-1042', totalFlightHours: 1444.5, notifications: [] },
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
    notifications: sampleNotifications.slice(0, 1),
  },
  render: (args) => ({
    components: { DashboardHeader },
    setup: () => ({ args }),
    template: '<DashboardHeader v-bind="args" />',
  }),
  parameters: { layout: 'fullscreen' },
}

export const WholeNumberHours: Story = {
  args: { pilotName: 'Susi Susanti', pilotId: 'PSA-2204', totalFlightHours: 2200, notifications: [] },
  render: (args) => ({
    components: { DashboardHeader },
    setup: () => ({ args }),
    template: '<DashboardHeader v-bind="args" />',
  }),
  parameters: { layout: 'fullscreen' },
}

export const NoHoursStat: Story = {
  args: { pilotName: 'New Pilot', pilotId: 'PSA-9999', notifications: [] },
  render: (args) => ({
    components: { DashboardHeader },
    setup: () => ({ args }),
    template: '<DashboardHeader v-bind="args" />',
  }),
  parameters: { layout: 'fullscreen' },
}

const mixedNotifications: NotificationItem[] = [
  {
    id: 'upcoming-1',
    title: 'Duty starts in 2 hours',
    body: 'PDG → MKW, LET 410. Report by 14:30 LT.',
    time: 'Today, 14:30',
    variant: 'info',
    category: 'upcoming-flight',
  },
  {
    id: 'schedule-1',
    title: 'Schedule change',
    body: 'MKW leg added to tomorrow\'s roster.',
    time: '1h ago',
    variant: 'warning',
    category: 'schedule-change',
  },
  {
    id: 'doc-medical',
    title: 'Medical certificate expires soon',
    body: '14 days remaining — renew before 22 July 2026.',
    time: '2 days ago',
    variant: 'warning',
    category: 'document-expiry',
  },
  {
    id: 'verified-1',
    title: 'Flight log verified',
    body: 'Cruise log for flight SSI-2204 has been countersigned.',
    time: '2 days ago',
    read: true,
    variant: 'success',
    category: 'flight-verified',
  },
]

export const WithUnreadNotifications: Story = {
  args: {
    pilotName: 'John Doe',
    pilotId: 'PSA-1042',
    totalFlightHours: 1444.5,
    notifications: mixedNotifications,
  },
  render: (args) => ({
    components: { DashboardHeader },
    setup: () => ({ args }),
    template: '<DashboardHeader v-bind="args" />',
  }),
  parameters: { layout: 'fullscreen' },
}

export const AllRead: Story = {
  args: {
    pilotName: 'John Doe',
    pilotId: 'PSA-1042',
    totalFlightHours: 1444.5,
    notifications: mixedNotifications.map((n) => ({ ...n, read: true })),
  },
  render: (args) => ({
    components: { DashboardHeader },
    setup: () => ({ args }),
    template: '<DashboardHeader v-bind="args" />',
  }),
  parameters: { layout: 'fullscreen' },
}
