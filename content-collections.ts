// content-collections.ts
import { defineCollection, defineConfig } from '@content-collections/core';
import { z } from 'zod';

function withoutBody<T extends { content: string; _meta: { path: string } }>({
  content: _content,
  ...post
}: T) {
  return { ...post, slug: post._meta.path };
}

const posts = defineCollection({
  name: 'posts',
  directory: './src/blog',
  include: '**/*.{md,mdx}',
  schema: z.object({
    content: z.string(),
    title: z.string(),
    date: z.string(),
    spoiler: z.string(),
    group: z.string().optional(),
  }),
  transform: async post => withoutBody(post),
});

export default defineConfig({
  content: [posts],
});
