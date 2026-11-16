import { allPosts, type Post } from 'content-collections';
import { groupCard } from './share-cards';

export type PostSummary = Pick<Post, 'slug' | 'title' | 'spoiler' | 'date'>;

function toSummary({ slug, title, spoiler, date }: Post): PostSummary {
  return { slug, title, spoiler, date };
}

function newestFirst(a: Post, b: Post) {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

export function getListedPosts() {
  return allPosts
    .filter(post => !post.group)
    .sort(newestFirst)
    .map(toSummary);
}

export function getGroup(group: string) {
  const posts = allPosts
    .filter(post => post.group === group)
    .sort(newestFirst)
    .map(toSummary);
  return posts.length > 0
    ? { card: groupCard(group, allPosts), posts }
    : undefined;
}

export function getPost(slug: string) {
  const post = allPosts.find(p => p.slug === slug);
  return post ? toSummary(post) : undefined;
}
