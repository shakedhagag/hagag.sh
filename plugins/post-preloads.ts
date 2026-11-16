import type { Plugin, Rolldown } from 'vite-plus';

const VIRTUAL_ID = 'virtual:ssr-post-preloads';
const RESOLVED_ID = `\0${VIRTUAL_ID}`;
const POST_MODULE = /\/src\/blog\/(.+)\.mdx$/;

function chunkClosure(bundle: Rolldown.OutputBundle, fileName: string) {
  const files = new Set<string>();
  const visit = (name: string) => {
    const chunk = bundle[name];
    if (!chunk || chunk.type !== 'chunk' || chunk.isEntry || files.has(name)) {
      return;
    }
    files.add(name);
    chunk.imports.forEach(visit);
  };
  visit(fileName);
  return [...files];
}

/**
 * Posts load their MDX chunk lazily, so the client build's route manifest
 * doesn't know it. This records each post's client chunks while the client
 * environment builds and serves them to the server build (built after it).
 */
export function postPreloads(): Plugin {
  const preloads: Record<string, Array<string>> = {};

  return {
    name: 'post-preloads',
    sharedDuringBuild: true,
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
      return null;
    },
    load(id) {
      if (id !== RESOLVED_ID) return null;
      const isServerBuild =
        this.environment.mode === 'build' && this.environment.name !== 'client';
      return `export default ${JSON.stringify(isServerBuild ? preloads : {})};`;
    },
    generateBundle(_options, bundle) {
      if (this.environment.name !== 'client') return;
      const { base } = this.environment.config;
      for (const output of Object.values(bundle)) {
        if (output.type !== 'chunk') continue;
        const slug = output.facadeModuleId?.match(POST_MODULE)?.[1];
        if (!slug) continue;
        preloads[slug] = chunkClosure(bundle, output.fileName).map(
          file => `${base}${file}`
        );
      }
    },
  };
}
