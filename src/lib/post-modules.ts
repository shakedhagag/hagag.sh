import type { MDXModule } from './mdx';

// Lazy glob: each post (and the demos it imports) becomes its own chunk.
const importers = import.meta.glob<MDXModule>('/src/blog/**/*.mdx');

const requests = new Map<string, Promise<MDXModule>>();
const loaded = new Map<string, MDXModule>();

/** Imports a post's compiled MDX by slug, once per slug. */
export function loadPostModule(slug: string): Promise<MDXModule> {
  let request = requests.get(slug);
  if (!request) {
    const importer = importers[`/src/blog/${slug}.mdx`];
    if (!importer) {
      return Promise.reject(new Error(`No MDX module for post "${slug}"`));
    }
    request = importer().then(mod => {
      loaded.set(slug, mod);
      return mod;
    });
    requests.set(slug, request);
  }
  return request;
}

/** The module for a slug, if loadPostModule has already resolved it. */
export function getLoadedPostModule(slug: string) {
  return loaded.get(slug);
}
