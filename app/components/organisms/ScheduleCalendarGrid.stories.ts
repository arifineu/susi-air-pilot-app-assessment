import type { Meta, StoryObj } from '@storybook/vue3'
import ScheduleCalendarGrid from './ScheduleCalendarGrid.vue'
import schedulesData from '~/assets/data/mock-schedules.json'

const meta: Meta<typeof ScheduleCalendarGrid> = {
  title: 'Organisms/ScheduleCalendarGrid',
  component: ScheduleCalendarGrid,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof ScheduleCalendarGrid>

export const May2026: Story = {
  args: {
    schedules: schedulesData.schedules,
    legend: schedulesData.legend,
    yearMonth: '2026-05',
    today: '2026-05-15', // schedules.json's today
  },
  render: (args) => ({
    components: { ScheduleCalendarGrid },
    setup: () => ({ args }),
    template: '<ScheduleCalendarGrid v-bind="args" />',
  }),
  parameters: { layout: 'fullscreen', viewport: { defaultViewport: 'mobile1' } },
}

export const April2026: Story = {
  args: {
    schedules: schedulesData.schedules,
    legend: schedulesData.legend,
    yearMonth: '2026-04',
    today: '2026-05-15',
  },
  render: (args) => ({
    components: { ScheduleCalendarGrid },
    setup: () => ({ args }),
    template: '<ScheduleCalendarGrid v-bind="args" />',
  }),
  parameters: { layout: 'fullscreen' },
}

export const June2026: Story = {
  args: {
    schedules: schedulesData.schedules,
    legend: schedulesData.legend,
    yearMonth: '2026-06',
    today: '2026-05-15',
  },
  render: (args) => ({
    components: { ScheduleCalendarGrid },
    setup: () => ({ args }),
    template: '<ScheduleCalendarGrid v-bind="args" />',
  }),
  parameters: { layout: 'fullscreen' },
}

export const Empty: Story = {
  args: {
    schedules: [],
    legend: schedulesData.legend,
    yearMonth: '2026-05',
    today: '2026-05-15',
  },
  render: (args) => ({
    components: { ScheduleCalendarGrid },
    setup: () => ({ args }),
    template: '<ScheduleCalendarGrid v-bind="args" />',
  }),
  parameters: { layout: 'fullscreen' },
}
