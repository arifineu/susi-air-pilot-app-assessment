import path from 'node:path'
import { fileURLToPath } from 'node:url'
import vuePlugin from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import type { StorybookConfig } from '@storybook/vue3-vite'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const config: StorybookConfig = {
  stories: ['../app/components/**/*.stories.ts', '../app/composables/**/*.stories.ts'],
  addons: ['@storybook/addon-docs'],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  viteFinal: async (config) => {
    // 1. Allow Vite to serve files from ../app/ (stories live outside .storybook/).
    config.server ??= {}
    config.server.fs ??= {}
    config.server.fs.allow = [
      ...(config.server.fs.allow ?? []),
      projectRoot,
      path.resolve(projectRoot, '..'),
    ]

    config.plugins ??= []

    // 2. Explicitly register the Vue SFC plugin — without it Vite can't parse
    //    .vue files (returns 404 with "Failed to parse source for import analysis").
    config.plugins.push(vuePlugin())

    // 3. Mirror Nuxt's auto-imports so component <script setup> blocks can
    //    drop `import { ref, computed } from 'vue'` + component imports.
    config.plugins.push(
      AutoImport({
        imports: ['vue'],
        dirs: [path.resolve(projectRoot, 'app/composables'), path.resolve(projectRoot, 'app/stores')],
        dts: false,
        vueTemplate: true,
      }) as never,
    )
    config.plugins.push(
      Components({
        dirs: [path.resolve(projectRoot, 'app/components')],
        directoryAsNamespace: false,
        dts: false,
      }) as never,
    )

    // 4. Register the `~` / `@` aliases pointing at app/ — Nuxt provides these
    //    automatically in dev, but Storybook's Vite doesn't have Nuxt's plugin.
    config.resolve ??= {}
    config.resolve.alias ??= {}
    config.resolve.alias['~'] = path.resolve(projectRoot, 'app')
    config.resolve.alias['@'] = path.resolve(projectRoot, 'app')

    return config
  },
}

export default config
