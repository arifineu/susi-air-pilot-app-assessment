<script setup lang="ts">
/**
 * Sign In page — uses the auth layout (no bottom nav).
 * Submit navigates to /home with no auth check, per brief §5.
 */
import { navigateTo } from '#app'

definePageMeta({ layout: 'auth' })

const loading = ref(false)
const error = ref('')

// Inline CRD contact alert — replaces the intimidating window.alert.
// Shown when the user clicks "Need help? Contact CRD" inside SignInForm.
const showCrdAlert = ref(false)

interface Credentials {
  pilotId: string
  password: string
}

async function onSubmit(_creds: Credentials) {
  // Brief explicitly says "no real auth check" — simulate a brief loading
  // state for UX feedback, then navigate.
  loading.value = true
  error.value = ''
  try {
    await new Promise((resolve) => setTimeout(resolve, 300))
    await navigateTo('/home')
  } catch {
    loading.value = false
    error.value = 'Something went wrong. Please try again.'
  }
}

function onContactCrd() {
  showCrdAlert.value = true
}
</script>

<template>
  <div class="sign-in-page">
    <AtomsFeedbackAlert
      v-if="showCrdAlert"
      variant="info"
      title="Need help?"
      dismissible
      class="sign-in-page__alert"
      @dismiss="showCrdAlert = false"
    >
      Contact the <strong>Crew Roster Desk (CRD)</strong> at
      <strong>+62 21 5590 0010</strong> — available 24/7.
    </AtomsFeedbackAlert>

    <OrganismsAuthSignInForm :loading="loading" :error="error" @submit="onSubmit" @contact-crd="onContactCrd" />
  </div>
</template>

<style scoped lang="scss">
.sign-in-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);

  &__alert {
    width: 100%;
  }
}
</style>
