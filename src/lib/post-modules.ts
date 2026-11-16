import type { MDXModule } from './mdx';

const importers = import.meta.glob<MDXModule>('/src/blog/**/*.mdx');

const requests = new Map<string, Promise<MDXModule>>();
const loaded = new Map<string, MDXModule>();

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

export function getLoadedPostModule(slug: string) {
  return loaded.get(slug);
}
