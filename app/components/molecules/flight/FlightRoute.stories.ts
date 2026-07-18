import type { Meta, StoryObj } from '@storybook/vue3'
import FlightRoute from './FlightRoute.vue'

const meta: Meta<typeof FlightRoute> = {
  title: 'Molecules/FlightRoute',
  component: FlightRoute,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof FlightRoute>

export const Default: Story = {
  args: {
    departure: { icao: 'PDG', city: 'Padang' },
    arrival: { icao: 'MKW', city: 'Mukomuko' },
    flightNumber: 'SSI-2204',
  },
}

export const NoFlightNo: Story = {
  args: {
    departure: { icao: 'HLP' },
    arrival: { icao: 'SIQ' },
  },
}
