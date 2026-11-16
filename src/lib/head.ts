import { ogImagePath, type ShareCard } from './share-cards';
import { absoluteUrl, SITE_NAME } from './site';

const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;

function documentTitle(title: string) {
  return title === SITE_NAME ? title : `${title} · ${SITE_NAME}`;
}

export function fontPreload(href: string) {
  return {
    rel: 'preload',
    as: 'font',
    type: 'font/woff2',
    href,
    crossOrigin: 'anonymous' as const,
  };
}

/** Title, description, Open Graph and Twitter tags for a shared page. */
export function shareMeta(
  card: ShareCard,
  { type = 'website' }: { type?: 'website' | 'article' } = {}
) {
  const image = absoluteUrl(ogImagePath(card));
  return [
    { title: documentTitle(card.title) },
    { name: 'description', content: card.description },
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:type', content: type },
    { property: 'og:title', content: card.title },
    { property: 'og:description', content: card.description },
    { property: 'og:image', content: image },
    { property: 'og:image:type', content: 'image/png' },
    { property: 'og:image:width', content: String(OG_IMAGE_WIDTH) },
    { property: 'og:image:height', content: String(OG_IMAGE_HEIGHT) },
    { property: 'og:image:alt', content: card.title },
    { name: 'twitter:card', content: 'summary_large_image' },
    ...(type === 'article' && card.date
      ? [{ property: 'article:published_time', content: card.date }]
      : []),
  ];
}

/**
 * og:url meta plus the matching canonical link for a page, from the path the
 * router matched (trailing slash dropped, as Cloudflare serves it).
 */
export function canonical(pathname: string) {
  const url = absoluteUrl(pathname.replace(/(.)\/$/, '$1'));
  return {
    meta: [{ property: 'og:url', content: url }],
    links: [{ rel: 'canonical', href: url }],
  };
}

export const OG_IMAGE_SIZE = { width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT };
