import type { Meta, StoryObj } from '@storybook/vue3'
import Skeleton from './Skeleton.vue'

const meta: Meta<typeof Skeleton> = {
  title: 'Atoms/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof Skeleton>

export const Text: Story = {
  args: { variant: 'text' },
  render: (args) => ({
    components: { Skeleton },
    setup: () => ({ args }),
    template: '<Skeleton v-bind="args" />',
  }),
}

export const Rect: Story = {
  args: { variant: 'rect', height: 120 },
  render: (args) => ({
    components: { Skeleton },
    setup: () => ({ args }),
    template: '<Skeleton v-bind="args" />',
  }),
}

export const Circle: Story = {
  args: { variant: 'circle' },
  render: (args) => ({
    components: { Skeleton },
    setup: () => ({ args }),
    template: '<Skeleton v-bind="args" />',
  }),
}

export const NewsCardSkeleton: Story = {
  render: () => ({
    components: { Skeleton },
    template: `
      <div style="width: 280px; background: #fff; border-radius: 14px; overflow: hidden; box-shadow: 0 1px 3px rgba(14,33,56,0.05);">
        <Skeleton variant="rect" :height="158" radius="0" />
        <div style="padding: 16px; display: flex; flex-direction: column; gap: 8px;">
          <Skeleton variant="text" :width="60" :height="10" />
          <Skeleton variant="text" :height="16" />
          <Skeleton variant="text" />
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" :width="40" :height="10" />
        </div>
      </div>
    `,
  }),
}
