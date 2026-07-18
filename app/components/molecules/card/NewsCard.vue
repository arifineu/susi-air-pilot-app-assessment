<script setup lang="ts">
/**
 * NewsCard
 * Compact card for the Latest News carousel. Image header, category chip,
 * title, and optional meta (date / read time).
 */

interface Props {
  category?: string
  title: string
  excerpt?: string
  imageUrl?: string
  date?: string
  readTime?: string
}
defineProps<Props>()
defineEmits<{ (e: 'click'): void }>()
</script>

<template>
  <article class="news-card" @click="$emit('click')">
    <div v-if="imageUrl || $slots.image" class="news-card__media">
      <slot name="image">
        <img v-if="imageUrl" :src="imageUrl" :alt="title" />
      </slot>
    </div>
    <div class="news-card__body">
      <AtomsDisplayChip v-if="category" class="news-card__category">{{ category }}</AtomsDisplayChip>
      <h3 class="news-card__title">{{ title }}</h3>
      <p v-if="excerpt" class="news-card__excerpt">{{ excerpt }}</p>
      <div v-if="date || readTime" class="news-card__meta">
        <span v-if="date">{{ date }}</span>
        <span v-if="date && readTime" aria-hidden="true">·</span>
        <span v-if="readTime">{{ readTime }}</span>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
.news-card {
  display: flex;
  flex-direction: column;
  background: var(--color-surface);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  cursor: pointer;
  width: 280px;
  flex-shrink: 0;
  transition: box-shadow 0.15s ease, transform 0.1s ease;

  &:hover {
    box-shadow: var(--shadow-md);
  }

  &:active {
    transform: translateY(0.5px);
  }

  &__media {
    width: 100%;
    aspect-ratio: 16 / 9;
    background: var(--color-surface-alt);
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__body {
    padding: var(--space-4);
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }
  
  &__category {
    width: fit-content;
    font-size: var(--fs-xs);
    font-weight: var(--fw-semibold);
    color: var(--color-text-secondary);
    background: var(--color-surface-alt);
    padding: 2px var(--space-2);
    border-radius: var(--radius-full);
  }

  &__title {
    margin: 0;
    font-size: var(--fs-md);
    font-weight: var(--fw-bold);
    color: var(--color-text-primary);
    line-height: 1.3;
  }

  &__excerpt {
    margin: 0;
    font-size: var(--fs-base);
    color: var(--color-text-secondary);
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__meta {
    display: flex;
    gap: var(--space-2);
    font-size: var(--fs-xs);
    color: var(--color-text-secondary);
    margin-top: var(--space-1);
  }
}
</style>
