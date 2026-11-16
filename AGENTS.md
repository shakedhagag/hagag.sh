# hagag.sh

Every page is server-rendered and prerendered to static HTML at build time (`tanstackStart({ prerender })` in `vite.config.ts`). Posts are MDX in `src/blog/`; each compiles to its own chunk and exports a build-time `toc`. A page's share card (`src/lib/share-cards.ts`) is the single source for its `<head>` tags and its generated `/og/<id>.png`.

`pnpm test` builds, then checks every prerendered page and OG image. `pnpm knip` reports dead files, exports and dependencies.

## Interactive components in posts

Posts hydrate fully, so a component imported from MDX is interactive with no extra wiring. Keep it SSR-safe:

- Put demos in `src/components/demos/`. Vite's dependency scanner cannot read `.mdx`; `vite.config.ts` points it at this folder so a demo's packages are pre-bundled before the first request. A demo elsewhere makes dev SSR fall back to client rendering.
- Render deterministically on the server: the first render matches on server and client. Read `window`, `localStorage`, `navigator`, dates or randomness inside effects or event handlers.
- A component that cannot render on the server goes inside TanStack's `<ClientOnly fallback={...}>`, with a fallback the same size as the component so the page does not shift.
