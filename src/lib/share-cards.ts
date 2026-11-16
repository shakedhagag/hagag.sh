import type { Post } from 'content-collections';
import { SITE_DESCRIPTION, SITE_NAME } from './site';

export type ShareCard = {
  id: string;
  title: string;
  description: string;
  date?: string;
};

type CardPost = Pick<Post, 'slug' | 'title' | 'spoiler' | 'date' | 'group'>;

export const SITE_CARD: ShareCard = {
  id: 'site',
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
};

function formatGroupName(group: string) {
  return group.charAt(0).toUpperCase() + group.slice(1).replace(/-/g, ' ');
}

export function postCard(post: CardPost): ShareCard {
  return {
    id: post.slug,
    title: post.title,
    description: post.spoiler,
    date: post.date,
  };
}

export function groupCard(group: string, posts: Array<CardPost>): ShareCard {
  const entry = posts.find(post => post.slug === group);
  const count = posts.filter(post => post.group === group).length;
  return {
    id: group,
    title: formatGroupName(group),
    description: entry?.spoiler ?? `A series of ${count} posts.`,
  };
}

export function allShareCards(posts: Array<CardPost>): Array<ShareCard> {
  const groups = new Set(
    posts.flatMap(post => (post.group ? [post.group] : []))
  );
  return [
    SITE_CARD,
    ...posts.filter(post => !groups.has(post.slug)).map(postCard),
    ...[...groups].map(group => groupCard(group, posts)),
  ];
}

export function ogImagePath(card: ShareCard) {
  return `/og/${card.id}.png`;
}
