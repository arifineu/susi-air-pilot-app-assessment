import type { Meta, StoryObj } from '@storybook/vue3'
import DocumentListItem from './DocumentListItem.vue'
import documents from '~/assets/data/mock-documents.json'

const meta: Meta<typeof DocumentListItem> = {
  title: 'Molecules/DocumentListItem',
  component: DocumentListItem,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof DocumentListItem>

const TODAY = documents.today // '2026-05-31'
const WARN = documents.thresholds.warningDays // 30

export const RecurrentSafe: Story = {
  args: { label: 'Next Recurrent Date', expiryDate: '2026-10-14', today: TODAY, warningDays: WARN },
}
export const PpcSafe: Story = {
  args: { label: 'PPC Exp. Date', expiryDate: '2026-12-25', today: TODAY, warningDays: WARN },
}
export const LicenseExpired: Story = {
  args: { label: 'Indonesian License Exp. Date', expiryDate: '2026-05-29', today: TODAY, warningDays: WARN },
}
export const MedicalSoon: Story = {
  args: { label: 'Indonesian Medical Exp. Date', expiryDate: '2026-06-11', today: TODAY, warningDays: WARN },
}
export const SecurityExpired: Story = {
  args: { label: 'Security Clearance Exp. Date', expiryDate: '2026-05-01', today: TODAY, warningDays: WARN },
}
