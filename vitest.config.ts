import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { createNuxtCompatResolver } from './config/nuxt-component-resolver'

export default defineConfig({
  plugins: [
    vue(),
    // Mirror Nuxt's auto-imports so component <script setup> blocks can drop
    // the explicit `import { ref, computed } from 'vue'` + component imports.
    AutoImport({
      imports: ['vue'],
      dirs: ['app/composables', 'app/stores'],
      dts: false,
      vueTemplate: true,
    }),
    // Mirror Nuxt's component auto-import with pathPrefix:true, including the
    // dedup rule (atoms/icon/Icon.vue → <AtomsIcon />). See
    // config/nuxt-component-resolver.ts for the matching logic.
    Components({
      dirs: [],
      resolvers: [createNuxtCompatResolver('app/components')],
      dts: false,
    }),
  ],
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['app/**/*.spec.ts'],
    setupFiles: ['./tests/setup-canvas-mock.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['app/components/**/*.vue', 'app/composables/**/*.ts'],
      exclude: ['**/*.stories.ts', '**/*.spec.ts', 'node_modules/**', '.nuxt/**'],
    },
  },
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./app/', import.meta.url)),
      '@': fileURLToPath(new URL('./app/', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        silenceDeprecations: ['legacy-js-api', 'import'],
      },
    },
  },
})
