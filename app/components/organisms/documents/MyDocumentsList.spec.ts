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
    // documents.json order: recurrent, ppc, license, medical, security
    expect(variants).toEqual(['safe', 'safe', 'expired', 'soon', 'expired'])
  })

  it('renders empty list when no documents', () => {
    const wrapper = mount(MyDocumentsList, { props: { documents: [] } })
    expect(wrapper.findAll('.document-list-item')).toHaveLength(0)
  })
})
