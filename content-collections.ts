// content-collections.ts
import { defineCollection, defineConfig } from '@content-collections/core';
import { z } from 'zod';

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
  // Only metadata goes into allPosts: it ships in the client bundle, while
  // the rendered body comes from each post's own MDX chunk.
  transform: async ({ content: _content, ...post }) => ({
    ...post,
    slug: post._meta.path,
  }),
});

export default defineConfig({
  content: [posts],
});
