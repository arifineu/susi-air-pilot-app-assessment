import type { Meta, StoryObj } from '@storybook/vue3'
import UpcomingFlightCard from './UpcomingFlightCard.vue'
import type { Schedule } from '~/types'

const meta: Meta<typeof UpcomingFlightCard> = {
  title: 'Organisms/UpcomingFlightCard',
  component: UpcomingFlightCard,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof UpcomingFlightCard>

const baseSchedule: Schedule = {
  id: '97037',
  duty_date: '2026-05-31',
  status: 1,
  base_name: 'MKW',
  base_color: '#10B981',
  duty_type: 'DTY',
  count_schedules: 2,
  count_logbooks: 0,
}

export const Default: Story = {
  args: {
    schedule: baseSchedule,
    departure: { icao: 'PDG', city: 'Padang' },
    arrival: { icao: 'MKW', city: 'Mukomuko' },
    departureTime: '08:15',
    arrivalTime: '09:40',
    flightNumber: 'SSI-2204',
  },
  render: (args) => ({
    components: { UpcomingFlightCard },
    setup: () => ({ args }),
    template: '<UpcomingFlightCard v-bind="args" />',
  }),
}

export const WithoutTimes: Story = {
  args: {
    schedule: baseSchedule,
    departure: { icao: 'PDG' },
    arrival: { icao: 'MKW' },
  },
  render: (args) => ({
    components: { UpcomingFlightCard },
    setup: () => ({ args }),
    template: '<UpcomingFlightCard v-bind="args" />',
  }),
}

export const Verified: Story = {
  args: {
    schedule: { ...baseSchedule, status: 2 },
    departure: { icao: 'PDG', city: 'Padang' },
    arrival: { icao: 'MKW', city: 'Mukomuko' },
    departureTime: '08:15',
    arrivalTime: '09:40',
  },
  render: (args) => ({
    components: { UpcomingFlightCard },
    setup: () => ({ args }),
    template: '<UpcomingFlightCard v-bind="args" />',
  }),
}
