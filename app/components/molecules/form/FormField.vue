<script setup lang="ts">
/**
 * FormField
 * Wraps BaseInput with optional action button + hint/error text slot.
 */

interface Props {
  modelValue?: string
  label?: string
  type?: 'text' | 'email' | 'password' | 'tel' | 'number'
  placeholder?: string
  error?: string
  hint?: string
  disabled?: boolean
  required?: boolean
  autocomplete?: string
  name?: string
  actionLabel?: string
}
const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'action'): void
}>()
</script>

<template>
  <div class="form-field">
    <AtomsFormBaseInput
      :model-value="props.modelValue"
      :label="label"
      :type="type"
      :placeholder="placeholder"
      :error="error"
      :hint="hint"
      :disabled="disabled"
      :required="required"
      :autocomplete="autocomplete"
      :name="name"
      @update:model-value="(v: string) => emit('update:modelValue', v)"
    />
    <AtomsFormBaseButton
      v-if="actionLabel"
      variant="ghost"
      size="sm"
      class="form-field__action"
      @click="emit('action')"
    >
      {{ actionLabel }}
    </AtomsFormBaseButton>
    <div v-if="$slots.hint" class="form-field__hint-slot"><slot name="hint" /></div>
  </div>
</template>

<style scoped lang="scss">
.form-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);

  &__action {
    align-self: flex-end;
    margin-top: calc(-1 * var(--space-1));
  }

  &__hint-slot {
    font-size: var(--fs-sm);
    color: var(--color-text-secondary);
  }
}
</style>
