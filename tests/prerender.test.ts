import { allPosts } from 'content-collections';
import { existsSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vite-plus/test';
import { escapeHtml } from '@/lib/escape-html';
import { allShareCards, ogImagePath, SITE_CARD } from '@/lib/share-cards';

const ROOT = join(import.meta.dirname, '..');
const OUT_DIR = join(ROOT, 'dist/client');

// Every page under /posts/<id>: posts (they have a date) and group listings.
const pages = allShareCards(allPosts).filter(card => card !== SITE_CARD);

function readPage(id: string) {
  const file = join(OUT_DIR, 'posts', encodeURIComponent(id), 'index.html');
  expect(existsSync(file), `missing ${relative(ROOT, file)}`).toBe(true);
  return readFileSync(file, 'utf8');
}

describe('prerendered pages', () => {
  it('has a build to check (run `vp build` first)', () => {
    expect(existsSync(OUT_DIR)).toBe(true);
  });

  it.each(pages)('$id is server-rendered', card => {
    const html = readPage(card.id);
    expect(
      html.includes('Switched to client rendering'),
      `${card.id} fell back to client rendering`
    ).toBe(false);

    const heading = card.date ? 'h1' : 'h2';
    const text = new RegExp(`<${heading}[^>]*>([^<]*)</${heading}>`).exec(
      html
    )?.[1];
    expect(text).toBe(escapeHtml(card.title));
  });

  it.each([SITE_CARD, ...pages])('$id has an OG image', card => {
    expect(existsSync(join(OUT_DIR, ogImagePath(card)))).toBe(true);
  });
});
