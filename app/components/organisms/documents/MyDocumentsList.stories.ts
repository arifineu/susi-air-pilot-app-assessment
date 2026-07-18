import type { Meta, StoryObj } from '@storybook/vue3'
import MyDocumentsList from './MyDocumentsList.vue'
import documents from '~/assets/data/mock-documents.json'

const meta: Meta<typeof MyDocumentsList> = {
  title: 'Organisms/MyDocumentsList',
  component: MyDocumentsList,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof MyDocumentsList>

export const FromJson: Story = {
  args: {
    documents: documents.documents,
    today: documents.today,
    warningDays: documents.thresholds.warningDays,
  },
  render: (args) => ({
    components: { MyDocumentsList },
    setup: () => ({ args }),
    template: '<MyDocumentsList v-bind="args" />',
  }),
}

export const Empty: Story = {
  args: { documents: [] },
  render: (args) => ({
    components: { MyDocumentsList },
    setup: () => ({ args }),
    template: '<MyDocumentsList v-bind="args" />',
  }),
}
