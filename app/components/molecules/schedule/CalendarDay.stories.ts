import type { Meta, StoryObj } from '@storybook/vue3'
import CalendarDay from './CalendarDay.vue'

const meta: Meta<typeof CalendarDay> = {
  title: 'Molecules/CalendarDay',
  component: CalendarDay,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof CalendarDay>

export const Empty: Story = { args: { dayNumber: 5 } }

export const OutOfMonth: Story = {
  args: { dayNumber: 28, isOutOfMonth: true },
}

export const TodayEmpty: Story = {
  args: { dayNumber: 31, isToday: true },
}

export const DutyComplete: Story = {
  args: {
    dayNumber: 14,
    baseColor: '#10B981',
    baseName: 'SIQ',
    dutyType: 'DTY',
    countSchedules: 6,
    countLogbooks: 6,
  },
}

export const DutyPending: Story = {
  args: {
    dayNumber: 21,
    baseColor: '#10B981',
    baseName: 'CJN',
    dutyType: 'DTY',
    countSchedules: 4,
    countLogbooks: 0,
  },
}

export const DutyPartiallyLogged: Story = {
  args: {
    dayNumber: 13,
    baseColor: '#10B981',
    baseName: 'MKW',
    dutyType: 'DTY',
    countSchedules: 4,
    countLogbooks: 2,
  },
}

export const TravelDay: Story = {
  args: {
    dayNumber: 4,
    baseColor: '#FBA577',
    baseName: 'CJN',
    dutyType: 'TRX',
    countSchedules: 1,
    countLogbooks: 0,
  },
}

export const TodayWithDuty: Story = {
  args: {
    dayNumber: 15,
    baseColor: '#10B981',
    baseName: 'MKW',
    dutyType: 'DTY',
    countSchedules: 6,
    countLogbooks: 0,
    isToday: true,
  },
}
