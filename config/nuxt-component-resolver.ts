/**
 * Mirror Nuxt's auto-imported component names in vitest + storybook.
 *
 * Problem: when `pathPrefix: true` is set on Nuxt's components module, Nuxt
 * deduplicates when the file's basename starts with the parent directory name.
 *   atoms/icon/Icon.vue           → <AtomsIcon />        (not <AtomsIconIcon />)
 *   atoms/brand/BrandLogo.vue     → <AtomsBrandLogo />   (not <AtomsBrandBrandLogo />)
 *   organisms/dashboard/DashboardHeader.vue → <OrganismsDashboardHeader />
 *
 * `unplugin-vue-components` (used in vitest + storybook) does NOT dedup the
 * same way, so the names it registers diverge from Nuxt's. We pre-walk the
 * components dir at config load time and build a name→path map using Nuxt's
 * exact rule, then expose it as a custom resolver.
 */
import { readdirSync, existsSync } from 'node:fs'
import path from 'node:path'

/** Convert a kebab/snake file-or-dir segment to PascalCase. */
function pascal(s: string): string {
  return s
    .toLowerCase()
    .split(/[-_]+/)
    .map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1))
    .join('')
}

interface ComponentInfo {
  /** Import name from the module — SFC default export. */
  name: 'default'
  /** Local alias so templates can reference `<ComponentName />`. */
  as: string
  /** Absolute path to the .vue file. */
  from: string
}

export function createNuxtCompatResolver(componentsDir: string) {
  const absRoot = path.resolve(componentsDir)
  const map = new Map<string, string>()

  function walk(dir: string, segments: string[] = []) {
    if (!existsSync(dir)) return
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const abs = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(abs, [...segments, entry.name])
      } else if (entry.name.endsWith('.vue')) {
        const base = entry.name.slice(0, -'.vue'.length)
        const pascalSegs = segments.map(pascal)
        // Nuxt dedup: if the last path segment is a prefix of the file's
        // PascalCase basename (case-insensitive), don't add it again.
        let prefix: string
        if (pascalSegs.length > 0) {
          const lastSeg = pascalSegs[pascalSegs.length - 1]
          if (base.toLowerCase().startsWith(lastSeg.toLowerCase())) {
            prefix = pascalSegs.slice(0, -1).join('')
          } else {
            prefix = pascalSegs.join('')
          }
        } else {
          prefix = ''
        }
        map.set(prefix + base, abs)
      }
    }
  }
  walk(absRoot)

  return (componentName: string): ComponentInfo | undefined => {
    const from = map.get(componentName)
    return from ? { name: 'default', as: componentName, from } : undefined
  }
}
