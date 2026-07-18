import type { Meta, StoryObj } from '@storybook/vue3'
import Badge from './Badge.vue'

const meta: Meta<typeof Badge> = {
  title: 'Atoms/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['safe', 'soon', 'expired', 'neutral'] },
  },
}
export default meta

type Story = StoryObj<typeof Badge>

export const Safe: Story = { args: { variant: 'safe', label: 'Safe' } }
export const Soon: Story = { args: { variant: 'soon', label: 'Soon' } }
export const Expired: Story = { args: { variant: 'expired', label: 'Expired' } }
export const Neutral: Story = { args: { variant: 'neutral', label: 'Pending' } }
export const SlottedLabel: Story = {
  args: { variant: 'soon' },
  render: (args) => ({
    components: { Badge },
    setup: () => ({ args }),
    template: '<Badge v-bind="args">11 days left</Badge>',
  }),
}
