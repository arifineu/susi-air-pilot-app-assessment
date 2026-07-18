import type { Meta, StoryObj } from '@storybook/vue3'
import DayFlightsModal from './DayFlightsModal.vue'
import type { Flight } from '~/types'

const meta: Meta<typeof DayFlightsModal> = {
  title: 'Organisms/DayFlightsModal',
  component: DayFlightsModal,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof DayFlightsModal>

const f = (overrides: Partial<Flight>): Flight => ({
  id: 'f',
  flight_number: 'SSI-2204',
  aircraft: 'LET 410',
  aircraft_registration: 'PK-LRB',
  departure: { icao: 'PDG', city: 'Padang', time: '14:30' },
  arrival: { icao: 'MKW', city: 'Mukomuko', time: '15:45' },
  duration_minutes: 75,
  status: 1,
  ...overrides,
})

const fullWindow = [
  {
    date: '2026-05-31',
    flights: [
      f({
        id: '97037-1',
        flight_number: 'SSI-1801',
        aircraft: 'Cessna Grand Caravan',
        aircraft_registration: 'PK-WGO',
        departure: { icao: 'MKW', city: 'Mukomuko', time: '08:30' },
        arrival: { icao: 'PDG', city: 'Padang', time: '09:45' },
        status: 2,
      }),
      f({
        id: '97037-2',
        flight_number: 'SSI-2204',
        aircraft: 'LET 410',
        aircraft_registration: 'PK-LRB',
        departure: { icao: 'PDG', city: 'Padang', time: '14:30' },
        arrival: { icao: 'MKW', city: 'Mukomuko', time: '15:45' },
      }),
      f({
        id: '97037-3',
        flight_number: 'SSI-2206',
        aircraft: 'Cessna Grand Caravan',
        aircraft_registration: 'PK-WGO',
        departure: { icao: 'MKW', city: 'Mukomuko', time: '18:00' },
        arrival: { icao: 'PLM', city: 'Palembang', time: '19:30' },
        duration_minutes: 90,
      }),
    ],
  },
  {
    date: '2026-06-01',
    flights: [
      f({
        id: '97038-1',
        flight_number: 'SSI-2301',
        aircraft: 'LET 410',
        departure: { icao: 'MKW', city: 'Mukomuko', time: '07:00' },
        arrival: { icao: 'PDG', city: 'Padang', time: '08:15' },
      }),
    ],
  },
  {
    date: '2026-06-02',
    flights: [
      f({
        id: '97039-1',
        flight_number: 'SSI-2302',
        aircraft: 'Cessna Grand Caravan',
        aircraft_registration: 'PK-WGO',
        departure: { icao: 'MKW', city: 'Mukomuko', time: '07:30' },
        arrival: { icao: 'PDG', city: 'Padang', time: '08:45' },
      }),
      f({
        id: '97039-2',
        flight_number: 'SSI-2304',
        aircraft: 'LET 410',
        aircraft_registration: 'PK-LRB',
        departure: { icao: 'PDG', city: 'Padang', time: '16:00' },
        arrival: { icao: 'PLM', city: 'Palembang', time: '17:30' },
        duration_minutes: 90,
      }),
    ],
  },
  {
    date: '2026-06-03',
    flights: [
      f({
        id: '97040-1',
        flight_number: 'SSI-2401',
        aircraft: 'Cessna Grand Caravan',
        aircraft_registration: 'PK-WGO',
        departure: { icao: 'MKW', city: 'Mukomuko', time: '06:45' },
        arrival: { icao: 'PKU', city: 'Pekanbaru', time: '08:00' },
      }),
      f({
        id: '97040-2',
        flight_number: 'SSI-2403',
        aircraft: 'Cessna Grand Caravan',
        aircraft_registration: 'PK-WGO',
        departure: { icao: 'PKU', city: 'Pekanbaru', time: '17:15' },
        arrival: { icao: 'MKW', city: 'Mukomuko', time: '18:30' },
      }),
    ],
  },
]

export const Default: Story = {
  args: { open: true, days: fullWindow },
  render: (args) => ({
    components: { DayFlightsModal },
    setup: () => ({ args }),
    template: '<DayFlightsModal v-bind="args" />',
  }),
  parameters: { layout: 'fullscreen' },
}

export const PartiallyEmpty: Story = {
  args: {
    open: true,
    days: [
      fullWindow[0]!,
      { date: '2026-06-01', flights: [] },
      fullWindow[2]!,
      fullWindow[3]!,
    ],
  },
  render: (args) => ({
    components: { DayFlightsModal },
    setup: () => ({ args }),
    template: '<DayFlightsModal v-bind="args" />',
  }),
  parameters: { layout: 'fullscreen' },
}

export const SingleDay: Story = {
  args: { open: true, days: [fullWindow[0]!] },
  render: (args) => ({
    components: { DayFlightsModal },
    setup: () => ({ args }),
    template: '<DayFlightsModal v-bind="args" />',
  }),
  parameters: { layout: 'fullscreen' },
}
