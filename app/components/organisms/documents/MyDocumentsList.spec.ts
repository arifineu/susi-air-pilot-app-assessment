import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MyDocumentsList from './MyDocumentsList.vue'
import documents from '~/assets/data/mock-documents.json'

describe('MyDocumentsList', () => {
  it('renders the default section title', () => {
    const wrapper = mount(MyDocumentsList, {
      props: { documents: documents.documents, today: documents.today },
    })
    expect(wrapper.find('.my-documents-list__title').text()).toBe('My Documents')
  })

  it('renders one DocumentListItem per document', () => {
    const wrapper = mount(MyDocumentsList, {
      props: { documents: documents.documents, today: documents.today },
    })
    expect(wrapper.findAll('.document-list-item')).toHaveLength(documents.documents.length)
  })

  it('passes the correct expiry status to each child (brief §3.1 worked examples)', () => {
    const wrapper = mount(MyDocumentsList, {
      props: {
        documents: documents.documents,
        today: documents.today,
        warningDays: documents.thresholds.warningDays,
      },
    })
    const badges = wrapper.findAll('.badge')
    const variants = badges.map((b) => {
      const cls = b.classes().find((c) => c.startsWith('badge--'))
      return cls?.replace('badge--', '')
    })
    // Sorted by expiryDate ascending: security(2026-05-01, expired),
    // license(2026-05-29, expired), medical(2026-06-11, soon),
    // recurrent(2026-10-14, safe), ppc(2026-12-25, safe).
    expect(variants).toEqual(['expired', 'expired', 'soon', 'safe', 'safe'])
  })

  it('renders empty list when no documents', () => {
    const wrapper = mount(MyDocumentsList, { props: { documents: [] } })
    expect(wrapper.findAll('.document-list-item')).toHaveLength(0)
  })

  describe('attention count', () => {
    it('shows "X expired · Y expiring soon" split by status, with separator', () => {
      const wrapper = mount(MyDocumentsList, {
        props: {
          documents: documents.documents,
          today: documents.today,
          warningDays: documents.thresholds.warningDays,
        },
      })
      // 5 docs → recurrent(safe), ppc(safe), license(expired), medical(soon), security(expired)
      // → 2 expired + 1 expiring soon.
      expect(wrapper.find('.my-documents-list__attention').text()).toBe('2 expired · 1 expiring soon')
    })

    it('colors the expired portion danger-red and the soon portion warning-amber', () => {
      const wrapper = mount(MyDocumentsList, {
        props: {
          documents: documents.documents,
          today: documents.today,
          warningDays: documents.thresholds.warningDays,
        },
      })
      expect(wrapper.find('.my-documents-list__attention-expired').text()).toBe('2 expired')
      expect(wrapper.find('.my-documents-list__attention-soon').text()).toBe('1 expiring soon')
      // Visual assertion via class presence — actual colors live in SCSS.
      expect(wrapper.find('.my-documents-list__attention-expired').exists()).toBe(true)
      expect(wrapper.find('.my-documents-list__attention-soon').exists()).toBe(true)
      expect(wrapper.find('.my-documents-list__attention-sep').exists()).toBe(true)
    })

    it('omits the separator and soon portion when only expired docs exist', () => {
      const wrapper = mount(MyDocumentsList, {
        props: {
          documents: [
            { id: 'a', label: 'Safe', expiryDate: '2027-01-01' },
            { id: 'b', label: 'Expired', expiryDate: '2025-01-01' },
            { id: 'c', label: 'Expired', expiryDate: '2024-01-01' },
          ],
          today: '2026-05-31',
        },
      })
      expect(wrapper.find('.my-documents-list__attention').text()).toBe('2 expired')
      expect(wrapper.find('.my-documents-list__attention-soon').exists()).toBe(false)
      expect(wrapper.find('.my-documents-list__attention-sep').exists()).toBe(false)
    })

    it('omits the separator and expired portion when only soon docs exist', () => {
      const wrapper = mount(MyDocumentsList, {
        props: {
          documents: [{ id: 'a', label: 'Soon', expiryDate: '2026-06-15' }],
          today: '2026-05-31',
        },
      })
      expect(wrapper.find('.my-documents-list__attention').text()).toBe('1 expiring soon')
      expect(wrapper.find('.my-documents-list__attention-expired').exists()).toBe(false)
      expect(wrapper.find('.my-documents-list__attention-sep').exists()).toBe(false)
    })

    it('hides the attention label when all documents are safe', () => {
      const wrapper = mount(MyDocumentsList, {
        props: {
          documents: [{ id: 'a', label: 'Safe', expiryDate: '2027-01-01' }],
          today: '2026-05-31',
        },
      })
      expect(wrapper.find('.my-documents-list__attention').exists()).toBe(false)
    })

    it('hides the attention label when the list is empty', () => {
      const wrapper = mount(MyDocumentsList, { props: { documents: [] } })
      expect(wrapper.find('.my-documents-list__attention').exists()).toBe(false)
    })
  })

  describe('sorting', () => {
    it('renders documents sorted by expiry date ascending (most urgent first)', () => {
      const wrapper = mount(MyDocumentsList, {
        props: {
          documents: documents.documents,
          today: documents.today,
          warningDays: documents.thresholds.warningDays,
        },
      })
      // Original mock order: recurrent(2026-10-14), ppc(2026-12-25),
      // license(2026-05-29), medical(2026-06-11), security(2026-05-01).
      // Sorted ascending by date: security, license, medical, recurrent, ppc.
      const labels = wrapper.findAll('.document-list-item__label').map((n) => n.text())
      expect(labels).toEqual([
        'Security Clearance Exp. Date', // security — 2026-05-01
        'Indonesian License Exp. Date', // license — 2026-05-29
        'Indonesian Medical Exp. Date', // medical — 2026-06-11
        'Next Recurrent Date',          // recurrent — 2026-10-14
        'PPC Exp. Date',                // ppc — 2026-12-25
      ])
    })

    it('does not mutate the input prop (returns a new sorted array)', () => {
      const input = [
        { id: 'b', label: 'B', expiryDate: '2027-01-01' },
        { id: 'a', label: 'A', expiryDate: '2026-01-01' },
      ]
      const wrapper = mount(MyDocumentsList, {
        props: { documents: input, today: '2025-01-01' },
      })
      // The rendered order is sorted, but the original array is unchanged.
      const labels = wrapper.findAll('.document-list-item__label').map((n) => n.text())
      expect(labels).toEqual(['A', 'B'])
      expect(input.map((d) => d.id)).toEqual(['b', 'a'])
    })
  })
})
