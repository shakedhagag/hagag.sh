# hagag.sh

Personal blog: TanStack Start + MDX, deployed to Cloudflare Workers. Every page is prerendered at build time; see `AGENTS.md` for how posts, interactive demos, and OG images fit together.

```bash
pnpm install
pnpm dev      # http://localhost:3000, OG images at /og/<slug>.png
pnpm build    # prerendered site + OG images in dist/
pnpm test     # build, then check every prerendered page
pnpm check    # format, lint, typecheck (oxfmt, oxlint)
pnpm knip     # unused files, exports, dependencies
pnpm deploy   # build and wrangler deploy
```
