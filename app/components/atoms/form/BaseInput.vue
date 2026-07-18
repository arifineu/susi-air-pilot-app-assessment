<script setup lang="ts">
/**
 * BaseInput
 * Label + text/password/email input with error state and password reveal toggle.
 * v-model compatibility via modelValue/modelModifiers (Vue 3 default).
 */
interface Props {
  modelValue?: string
  type?: 'text' | 'email' | 'password' | 'tel' | 'number'
  placeholder?: string
  label?: string
  error?: string
  hint?: string
  disabled?: boolean
  autocomplete?: string
  name?: string
  id?: string
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'blur' | 'focus', payload: FocusEvent): void
}>()

const showPassword = ref(false)
const inputType = computed(() => {
  if (props.type !== 'password') return props.type
  return showPassword.value ? 'text' : 'password'
})

const inputId = computed(() => props.id ?? props.name ?? `input-${Math.random().toString(36).slice(2, 9)}`)

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="base-input" :class="{ 'base-input--error': !!error, 'base-input--disabled': disabled }">
    <label v-if="label" :for="inputId" class="base-input__label">{{ label }}</label>
    <div class="base-input__field">
      <input
        :id="inputId"
        :name="name"
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :autocomplete="autocomplete"
        class="base-input__control"
        @input="onInput"
        @blur="(p) => emit('blur', p)"
        @focus="(p) => emit('focus', p)"
      />
      <button
        v-if="type === 'password'"
        type="button"
        class="base-input__reveal"
        :aria-label="showPassword ? 'Hide password' : 'Show password'"
        :tabindex="disabled ? -1 : 0"
        @click="showPassword = !showPassword"
      >
        {{ showPassword ? 'Hide' : 'Show' }}
      </button>
    </div>
    <p v-if="error" class="base-input__error">{{ error }}</p>
    <p v-else-if="hint" class="base-input__hint">{{ hint }}</p>
  </div>
</template>

<style scoped lang="scss">
.base-input {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);

  &__label {
    font-size: var(--fs-base-sm);
    font-weight: var(--fw-medium);
    color: var(--color-text-primary);
  }

  &__field {
    position: relative;
    display: flex;
    align-items: center;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }

  &__control {
    flex: 1;
    height: var(--control-height-md);
    padding: 0 var(--space-4);
    background: transparent;
    border: 0;
    outline: none;
    color: var(--color-text-primary);
    font-family: var(--font-sans);
    font-size: var(--fs-base);

    &::placeholder {
      color: var(--color-text-muted);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  &__reveal {
    background: transparent;
    border: 0;
    padding: 0 var(--space-3);
    color: var(--color-text-secondary);
    font-size: var(--fs-base-sm);
    font-weight: var(--fw-semibold);
    cursor: pointer;

    &:hover {
      color: var(--color-text-primary);
    }
  }

  &:focus-within &__field {
    border-color: var(--color-red);
    box-shadow: var(--shadow-focus);
  }

  &--error &__field {
    border-color: var(--color-danger);
    box-shadow: 0 0 0 3px rgba(230, 55, 87, 0.14);
  }

  &--error &__label {
    color: var(--color-danger);
  }

  &__error {
    margin: 0;
    font-size: var(--fs-sm);
    color: var(--color-danger);
  }

  &__hint {
    margin: 0;
    font-size: var(--fs-sm);
    color: var(--color-text-secondary);
  }

  &--disabled {
    opacity: 0.7;
  }
}
</style>
