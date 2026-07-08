import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { useLoadingDelay } from './useLoadingDelay'

/** Test harness — mounts the composable inside a real component so onMounted fires. */
function mountWithDelay(ms?: number) {
  let loadingRef!: ReturnType<typeof useLoadingDelay>
  const Comp = defineComponent({
    setup() {
      loadingRef = useLoadingDelay(ms)
      return () => h('div', loadingRef.value ? 'loading' : 'ready')
    },
  })
  const wrapper = mount(Comp)
  return { wrapper }
}

describe('useLoadingDelay', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts in the loading state', () => {
    const { wrapper } = mountWithDelay(500)
    expect(wrapper.text()).toBe('loading')
  })

  it('flips to false after the delay elapses', async () => {
    const { wrapper } = mountWithDelay(500)
    expect(wrapper.text()).toBe('loading')

    vi.advanceTimersByTime(500)
    await nextTick()

    expect(wrapper.text()).toBe('ready')
  })

  it('default delay is 500ms', async () => {
    const { wrapper } = mountWithDelay()
    vi.advanceTimersByTime(499)
    await nextTick()
    expect(wrapper.text()).toBe('loading')

    vi.advanceTimersByTime(2)
    await nextTick()
    expect(wrapper.text()).toBe('ready')
  })

  it('flips immediately when ms <= 0', async () => {
    const { wrapper } = mountWithDelay(0)
    await nextTick()
    expect(wrapper.text()).toBe('ready')
  })

  it('stays loading if the delay has not fully elapsed', async () => {
    const { wrapper } = mountWithDelay(500)
    vi.advanceTimersByTime(300)
    await nextTick()
    expect(wrapper.text()).toBe('loading')
  })
})
