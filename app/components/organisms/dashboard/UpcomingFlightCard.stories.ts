import type { Meta, StoryObj } from '@storybook/vue3'
import UpcomingFlightCard from './UpcomingFlightCard.vue'
import type { Flight, Schedule } from '~/types'

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
  count_schedules: 3,
  count_logbooks: 1,
}

const baseFlight: Flight = {
  id: '97037-2',
  flight_number: 'SSI-2204',
  aircraft: 'LET 410',
  aircraft_registration: 'PK-LRB',
  departure: { icao: 'PDG', city: 'Padang', time: '14:30' },
  arrival: { icao: 'MKW', city: 'Mukomuko', time: '15:45' },
  duration_minutes: 75,
  status: 1,
}

export const Default: Story = {
  args: { schedule: baseSchedule, flight: baseFlight },
  render: (args) => ({
    components: { UpcomingFlightCard },
    setup: () => ({ args }),
    template: '<UpcomingFlightCard v-bind="args" />',
  }),
}

export const CessnaGrandCaravan: Story = {
  args: {
    schedule: baseSchedule,
    flight: {
      ...baseFlight,
      flight_number: 'SSI-1801',
      aircraft: 'Cessna Grand Caravan',
      aircraft_registration: 'PK-WGO',
      departure: { icao: 'MKW', city: 'Mukomuko', time: '08:30' },
      arrival: { icao: 'PDG', city: 'Padang', time: '09:45' },
    },
  },
  render: (args) => ({
    components: { UpcomingFlightCard },
    setup: () => ({ args }),
    template: '<UpcomingFlightCard v-bind="args" />',
  }),
}

export const Verified: Story = {
  args: { schedule: { ...baseSchedule, status: 2 }, flight: baseFlight },
  render: (args) => ({
    components: { UpcomingFlightCard },
    setup: () => ({ args }),
    template: '<UpcomingFlightCard v-bind="args" />',
  }),
}

export const SingleLeg: Story = {
  args: {
    schedule: { ...baseSchedule, count_schedules: 1 },
    flight: baseFlight,
  },
  render: (args) => ({
    components: { UpcomingFlightCard },
    setup: () => ({ args }),
    template: '<UpcomingFlightCard v-bind="args" />',
  }),
}
