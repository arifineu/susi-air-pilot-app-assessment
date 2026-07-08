import type { Meta, StoryObj } from '@storybook/vue3'
import FlightHoursTrendChart from './FlightHoursTrendChart.vue'
import flightHoursData from '~/assets/data/mock-flight-hours.json'
import { computeRollingSumSeries } from '~/composables/useRollingSum'

const meta: Meta<typeof FlightHoursTrendChart> = {
  title: 'Organisms/FlightHoursTrendChart',
  component: FlightHoursTrendChart,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof FlightHoursTrendChart>

const TODAY = '2026-05-31'

const OneWeek: Story = {
  name: '1w',
  args: {
    series: computeRollingSumSeries(flightHoursData.flightHours, TODAY, 7),
    limit: flightHoursData.chartBounds['1w'].limit,
    max: flightHoursData.chartBounds['1w'].max,
    unit: 'h',
  },
  render: (args) => ({
    components: { FlightHoursTrendChart },
    setup: () => ({ args }),
    template: '<FlightHoursTrendChart v-bind="args" />',
  }),
}

const OneMonth: Story = {
  name: '1m',
  args: {
    series: computeRollingSumSeries(flightHoursData.flightHours, TODAY, 30),
    limit: flightHoursData.chartBounds['1m'].limit,
    max: flightHoursData.chartBounds['1m'].max,
    unit: 'h',
  },
  render: (args) => ({
    components: { FlightHoursTrendChart },
    setup: () => ({ args }),
    template: '<FlightHoursTrendChart v-bind="args" />',
  }),
}

const OneYear: Story = {
  name: '1y',
  args: {
    series: computeRollingSumSeries(flightHoursData.flightHours, TODAY, 365),
    limit: flightHoursData.chartBounds['1y'].limit,
    max: flightHoursData.chartBounds['1y'].max,
    unit: 'h',
  },
  render: (args) => ({
    components: { FlightHoursTrendChart },
    setup: () => ({ args }),
    template: '<FlightHoursTrendChart v-bind="args" />',
  }),
}

export { OneWeek, OneMonth, OneYear }
