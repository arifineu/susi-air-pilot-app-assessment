// Flat config for ESLint 10.
// @nuxt/eslint auto-generates `.nuxt/eslint.config.mjs` (a flat config array)
// at `nuxt prepare` time. We import it via `withNuxt` and append our own
// overrides / disables as a final config object.
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'vue/no-v-html': 'off',
    // Deprecated rule; the Vue team recommends TypeScript optional props
    // (`prop?: type`) over `default` for genuinely-optional props. Every
    // warning it raised here was a prop that's intentionally optional with
    // no default (e.g. `pilotAvatar?`, `title?`).
    'vue/require-default-prop': 'off',
    // The project consistently self-closes void elements (`<img/>`,
    // `<input/>`). The rule prefers `<img>` — pure style choice, no
    // correctness impact, so disable to match the existing convention.
    'vue/html-self-closing': 'off',
  },
  ignores: ['node_modules/**', '.nuxt/**', '.output/**', 'dist/**', 'storybook-static/**', 'coverage/**'],
})
