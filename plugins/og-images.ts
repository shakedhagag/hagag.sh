import type { Post } from 'content-collections';
import type { Plugin } from 'vite-plus';
import { format } from 'date-fns';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { render } from 'takumi-js';
import { escapeHtml } from '../src/lib/escape-html';
import { OG_IMAGE_SIZE } from '../src/lib/head';
import {
  allShareCards,
  ogImagePath,
  type ShareCard,
} from '../src/lib/share-cards';
import { SITE_NAME } from '../src/lib/site';

const require = createRequire(import.meta.url);

const COLORS = {
  background: 'hsl(216, 16%, 6%)',
  foreground: 'hsl(210, 10%, 90%)',
  muted: 'hsl(210, 6%, 62%)',
  accent: 'hsl(280, 100%, 85%)',
};

const FONT_FILES = {
  Inter: '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',
  Manrope: '@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2',
};

let fonts: Promise<Array<{ name: string; data: Buffer }>> | undefined;
function loadFonts() {
  fonts ??= Promise.all(
    Object.entries(FONT_FILES).map(async ([name, file]) => ({
      name,
      data: await readFile(require.resolve(file)),
    }))
  );
  return fonts;
}

/**
 * Reads the posts content-collections generated. The file has no imports, so
 * evaluating a fresh copy each time picks up edits in dev without Node's
 * module cache getting in the way.
 */
async function loadPosts(root: string): Promise<Array<Post>> {
  const source = await readFile(
    join(root, '.content-collections/generated/allPosts.js'),
    'utf8'
  );
  const mod = await import(
    `data:text/javascript,${encodeURIComponent(source)}`
  );
  return mod.default;
}

function cardHtml(card: ShareCard) {
  const titleSize = card.title.length > 48 ? 60 : 76;
  const footer = card.date ? format(new Date(card.date), 'MMMM d, yyyy') : '';

  return `
<div style="display:flex;flex-direction:column;justify-content:space-between;width:100%;height:100%;padding:72px 80px;background-color:${COLORS.background};background-image:radial-gradient(circle at 100% 0%, hsla(280, 100%, 85%, 0.16), transparent 55%);color:${COLORS.foreground};font-family:Manrope">
  <div style="display:flex;font-size:34px;font-weight:800;color:${COLORS.accent}">${SITE_NAME}</div>
  <div style="display:flex;flex-direction:column;gap:24px">
    <div style="display:flex;font-family:Inter;font-size:${titleSize}px;font-weight:600;line-height:1.1;letter-spacing:-1.5px">${escapeHtml(card.title)}</div>
    <div style="display:flex;font-size:32px;line-height:1.35;color:${COLORS.muted}">${escapeHtml(card.description)}</div>
  </div>
  <div style="display:flex;font-size:26px;letter-spacing:2px;color:${COLORS.muted}">${footer}</div>
</div>`;
}

async function renderCard(card: ShareCard) {
  return render(cardHtml(card), {
    ...OG_IMAGE_SIZE,
    format: 'png',
    fonts: await loadFonts(),
  });
}

export function ogImages(): Plugin {
  let root = process.cwd();

  return {
    name: 'og-images',
    configResolved(config) {
      root = config.root;
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const id = req.url?.match(/^\/og\/(.+)\.png$/)?.[1];
        if (!id) return next();
        try {
          const cards = allShareCards(await loadPosts(root));
          const card = cards.find(c => c.id === decodeURIComponent(id));
          if (!card) return next();
          res.setHeader('Content-Type', 'image/png');
          res.end(await renderCard(card));
        } catch (error) {
          next(error);
        }
      });
    },
    async generateBundle() {
      if (this.environment.name !== 'client') return;
      const cards = allShareCards(await loadPosts(root));
      await Promise.all(
        cards.map(async card => {
          this.emitFile({
            type: 'asset',
            fileName: ogImagePath(card).slice(1),
            source: await renderCard(card),
          });
        })
      );
    },
  };
}
