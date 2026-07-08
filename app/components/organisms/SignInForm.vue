<script setup lang="ts">
/**
 * SignInForm
 * Pilot ID + Password form. Per brief §5: submit routes to /home with no
 * real auth check (Phase 3 only renders the form; routing happens Phase 5).
 *
 * MUST include the "Need help? Contact CRD" helper link below the form —
 * easy to treat as decorative and skip.
 */

interface Props {
  loading?: boolean
  error?: string
}
withDefaults(defineProps<Props>(), { loading: false, error: '' })

const emit = defineEmits<{
  (e: 'submit', payload: { pilotId: string; password: string }): void
  (e: 'contact-crd'): void
}>()

const pilotId = ref('')
const password = ref('')

function onSubmit() {
  emit('submit', { pilotId: pilotId.value, password: password.value })
}
</script>

<template>
  <form class="sign-in-form" @submit.prevent="onSubmit">
    <header class="sign-in-form__header">
      <h1 class="sign-in-form__title">Welcome back</h1>
      <p class="sign-in-form__subtitle">Sign in to your pilot dashboard</p>
    </header>

    <FormField
      v-model="pilotId"
      label="Pilot ID"
      name="pilotId"
      placeholder="PSA-1042"
      autocomplete="username"
      required
    />
    <FormField
      v-model="password"
      label="Password"
      type="password"
      name="password"
      placeholder="••••••••"
      autocomplete="current-password"
      required
    />

    <p v-if="error" class="sign-in-form__error" role="alert">{{ error }}</p>

    <BaseButton type="submit" variant="primary" size="lg" full-width :loading="loading">
      Sign In
    </BaseButton>

    <!-- CRD helper link — REQUIRED per brief §5. NOT decorative. -->
    <p class="sign-in-form__help">
      Need help?
      <button type="button" class="sign-in-form__help-link" @click="$emit('contact-crd')">
        Contact CRD
      </button>
    </p>
  </form>
</template>

<style scoped lang="scss">
.sign-in-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
  padding: var(--space-6) var(--space-4);
  background: var(--color-surface);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-sm);

  &__header {
    text-align: center;
    margin-bottom: var(--space-2);
  }

  &__title {
    margin: 0;
    font-size: var(--fs-2xl);
    font-weight: var(--fw-bold);
    color: var(--color-text-primary);
  }

  &__subtitle {
    margin: var(--space-1) 0 0;
    font-size: var(--fs-base);
    color: var(--color-text-secondary);
  }

  &__error {
    margin: 0;
    padding: var(--space-2) var(--space-3);
    background: rgba(230, 55, 87, 0.08);
    color: var(--color-danger);
    font-size: var(--fs-base-sm);
    border-radius: var(--radius-sm);
  }

  &__help {
    margin: var(--space-2) 0 0;
    text-align: center;
    font-size: var(--fs-base-sm);
    color: var(--color-text-secondary);
  }

  &__help-link {
    background: transparent;
    border: 0;
    padding: 0 0 0 var(--space-1);
    color: var(--color-red);
    font-weight: var(--fw-semibold);
    cursor: pointer;
    text-decoration: underline;

    &:hover {
      color: var(--color-red-dark);
    }
  }
}
</style>
