import type { Meta, StoryObj } from '@storybook/vue3'
import ScheduleLegend from './ScheduleLegend.vue'
import schedules from '~/assets/data/mock-schedules.json'

const meta: Meta<typeof ScheduleLegend> = {
  title: 'Organisms/ScheduleLegend',
  component: ScheduleLegend,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof ScheduleLegend>

export const FromJson: Story = {
  args: { legend: schedules.legend, columns: 2 },
  render: (args) => ({
    components: { ScheduleLegend },
    setup: () => ({ args }),
    template: '<ScheduleLegend v-bind="args" />',
  }),
}

export const SingleColumn: Story = {
  args: { legend: schedules.legend, columns: 1 },
  render: (args) => ({
    components: { ScheduleLegend },
    setup: () => ({ args }),
    template: '<ScheduleLegend v-bind="args" />',
  }),
}

export const Empty: Story = {
  args: { legend: [] },
  render: (args) => ({
    components: { ScheduleLegend },
    setup: () => ({ args }),
    template: '<ScheduleLegend v-bind="args" />',
  }),
}
