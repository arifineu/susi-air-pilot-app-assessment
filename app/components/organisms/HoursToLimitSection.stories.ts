import type { Meta, StoryObj } from '@storybook/vue3'
import HoursToLimitSection from './HoursToLimitSection.vue'
import flightHoursData from '~/assets/data/mock-flight-hours.json'

const meta: Meta<typeof HoursToLimitSection> = {
  title: 'Organisms/HoursToLimitSection',
  component: HoursToLimitSection,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof HoursToLimitSection>

export const Default1w: Story = {
  args: {
    flightHours: flightHoursData.flightHours,
    limits: flightHoursData.limits,
    chartBounds: flightHoursData.chartBounds,
    today: '2026-05-31',
    initialRange: '1w',
  },
  render: (args) => ({
    components: { HoursToLimitSection },
    setup: () => ({ args }),
    template: '<HoursToLimitSection v-bind="args" />',
  }),
  parameters: { layout: 'fullscreen' },
}

export const Initial1m: Story = {
  args: {
    flightHours: flightHoursData.flightHours,
    limits: flightHoursData.limits,
    chartBounds: flightHoursData.chartBounds,
    today: '2026-05-31',
    initialRange: '1m',
  },
  render: (args) => ({
    components: { HoursToLimitSection },
    setup: () => ({ args }),
    template: '<HoursToLimitSection v-bind="args" />',
  }),
  parameters: { layout: 'fullscreen' },
}

export const Initial1y: Story = {
  args: {
    flightHours: flightHoursData.flightHours,
    limits: flightHoursData.limits,
    chartBounds: flightHoursData.chartBounds,
    today: '2026-05-31',
    initialRange: '1y',
  },
  render: (args) => ({
    components: { HoursToLimitSection },
    setup: () => ({ args }),
    template: '<HoursToLimitSection v-bind="args" />',
  }),
  parameters: { layout: 'fullscreen' },
}

// 390px audit story — confirms 4 LimitCards render as 2×2 at iPhone width
// (not 4-wide) per the brief's "Confirm 2×2 grid vs swipeable row behavior
// for the 4 limit cards on narrow screens."
export const Mobile390px: Story = {
  args: {
    flightHours: flightHoursData.flightHours,
    limits: flightHoursData.limits,
    chartBounds: flightHoursData.chartBounds,
    today: '2026-05-31',
    initialRange: '1w',
  },
  render: (args) => ({
    components: { HoursToLimitSection },
    setup: () => ({ args }),
    template: '<HoursToLimitSection v-bind="args" />',
  }),
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'mobile1' },
  },
}
