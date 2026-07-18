<script setup lang="ts">
/**
 * LatestNewsCarousel
 * Horizontal scrollable row of NewsCards. Pure CSS scroll-snap — no JS
 * carousel lib, no reflow on resize, works with keyboard arrow keys.
 */
import type { NewsItem } from '~/types'

interface Props {
  items: NewsItem[]
  title?: string
}
withDefaults(defineProps<Props>(), { title: 'Latest News' })

defineEmits<{ (e: 'select', id: string): void }>()
</script>

<template>
  <section class="latest-news-carousel">
    <header class="latest-news-carousel__header">
      <h2 class="latest-news-carousel__title">{{ title }}</h2>
    </header>
    <div class="latest-news-carousel__scroll" role="region" :aria-label="title" tabindex="0">
      <MoleculesCardNewsCard
        v-for="item in items"
        :id="item.id"
        :key="item.id"
        :category="item.category"
        :title="item.title"
        :excerpt="item.excerpt"
        :image-url="item.imageUrl"
        :date="item.date"
        :read-time="item.readTime"
        @click="$emit('select', item.id)"
      />
    </div>
  </section>
</template>

<style scoped lang="scss">
.latest-news-carousel {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-2);

  &__header {
    padding: 0 var(--space-2);
  }

  &__title {
    margin: 0;
    font-size: var(--fs-lg);
    font-weight: var(--fw-bold);
    color: var(--color-text-primary);
  }

  &__scroll {
    display: flex;
    gap: var(--space-3);
    overflow-x: auto;
    overflow-y: hidden;
    padding: var(--space-2);
    margin: calc(-1 * var(--space-2));
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;

    &:focus-visible {
      outline: none;
      box-shadow: var(--shadow-focus);
      border-radius: var(--radius-md);
    }

    // Make every NewsCard snap-aligned. Each child's first element becomes the
    // snap target so partial peek cards are encouraged on mobile.
    :deep(.news-card) {
      scroll-snap-align: start;
      flex-shrink: 0;
    }
  }
}
</style>
