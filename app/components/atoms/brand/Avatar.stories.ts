import type { Meta, StoryObj } from '@storybook/vue3'
import Avatar from './Avatar.vue'

const meta: Meta<typeof Avatar> = {
  title: 'Atoms/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
}
export default meta

type Story = StoryObj<typeof Avatar>

export const Image: Story = {
  args: {
    src: 'https://i.pravatar.cc/96?img=68',
    alt: 'Captain John Doe',
    name: 'John Doe',
    size: 'md',
  },
}

export const InitialsFallback: Story = {
  args: { name: 'John Doe', size: 'md' },
}

export const SingleName: Story = {
  args: { name: 'Susi', size: 'md' },
}

export const NoName: Story = {
  args: { size: 'md' },
}

export const Small: Story = {
  args: { name: 'John Doe', size: 'sm' },
}

export const Large: Story = {
  args: { name: 'John Doe', size: 'lg' },
}
