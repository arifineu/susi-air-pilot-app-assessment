import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DocumentListItem from './DocumentListItem.vue'

// Per brief §3.1 — the 5 worked examples (today=2026-05-31, warningDays=30)
const T = '2026-05-31'
const W = 30

describe('DocumentListItem', () => {
  it('renders the document label', () => {
    const wrapper = mount(DocumentListItem, {
      props: { label: 'PPC Exp. Date', expiryDate: '2026-12-25', today: T, warningDays: W },
    })
    expect(wrapper.find('.document-list-item__label').text()).toBe('PPC Exp. Date')
  })

  it('shows formatted expiry date', () => {
    const wrapper = mount(DocumentListItem, {
      props: { label: 'PPC', expiryDate: '2026-12-25', today: T, warningDays: W },
    })
    expect(wrapper.find('.document-list-item__date').text()).toBe('25 Dec 2026')
  })

  describe('badge variant maps to status (brief §3.1 examples)', () => {
    type Case = [string, string, 'safe' | 'soon' | 'expired']
    const cases: Case[] = [
      ['Next Recurrent Date', '2026-10-14', 'safe'],
      ['PPC Exp. Date', '2026-12-25', 'safe'],
      ['Indonesian License Exp. Date', '2026-05-29', 'expired'],
      ['Indonesian Medical Exp. Date', '2026-06-11', 'soon'],
      ['Security Clearance Exp. Date', '2026-05-01', 'expired'],
    ]
    for (const [label, date, expected] of cases) {
      it(`${label} → ${expected}`, () => {
        const wrapper = mount(DocumentListItem, {
          props: { label, expiryDate: date, today: T, warningDays: W },
        })
        const badge = wrapper.find('.badge')
        expect(badge.classes()).toContain(`badge--${expected}`)
      })
    }
  })

  it('renders an expired label with "Xd overdue"', () => {
    const wrapper = mount(DocumentListItem, {
      props: { label: 'License', expiryDate: '2026-05-29', today: T, warningDays: W },
    })
    expect(wrapper.find('.badge__label').text()).toBe('2d overdue')
  })

  it('renders "Expired" (not -0d) when expiry is exactly today', () => {
    const wrapper = mount(DocumentListItem, {
      props: { label: 'X', expiryDate: '2026-05-31', today: T, warningDays: W },
    })
    expect(wrapper.find('.badge__label').text()).toBe('Expired')
  })

  it('renders "Xd left" for soon status', () => {
    const wrapper = mount(DocumentListItem, {
      props: { label: 'Medical', expiryDate: '2026-06-11', today: T, warningDays: W },
    })
    expect(wrapper.find('.badge__label').text()).toBe('11d left')
  })

  it('renders "Valid" label for safe status', () => {
    const wrapper = mount(DocumentListItem, {
      props: { label: 'PPC', expiryDate: '2026-12-25', today: T, warningDays: W },
    })
    expect(wrapper.find('.badge__label').text()).toBe('Valid')
  })
})
