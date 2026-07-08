<script setup lang="ts">
/**
 * Sign In page — uses the auth layout (no bottom nav).
 * Submit navigates to /home with no auth check, per brief §5.
 */
import { navigateTo } from '#app'

definePageMeta({ layout: 'auth' })

const loading = ref(false)
const error = ref('')

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
  // Phase 6 will replace this with a real toast/modal.
  if (typeof window !== 'undefined') {
    window.alert('Contact CRD: +62 21 5590 0010 (24/7)')
  }
}
</script>

<template>
  <SignInForm :loading="loading" :error="error" @submit="onSubmit" @contact-crd="onContactCrd" />
</template>
