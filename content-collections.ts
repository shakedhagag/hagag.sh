// content-collections.ts
import { defineCollection, defineConfig } from '@content-collections/core'
import { z } from 'zod'
import matter from 'gray-matter'

function extractFrontMatter(content: string) {
  const { data, content: body, excerpt } = matter(content, { excerpt: true })
  return { data, body, excerpt: excerpt || '' }
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
    customUrl: z.string().optional(),
  }),
  transform: ({ content, ...post }) => {
    const frontMatter = extractFrontMatter(content)

    // Extract header image (first image in the document)
    const headerImageMatch = content.match(/!\[([^\]]*)\]\(([^)]+)\)/)
    const headerImage = headerImageMatch ? headerImageMatch[2] : undefined

    return {
      ...post,
      slug: post._meta.path,
      excerpt: frontMatter.excerpt,
      spoiler: post.spoiler, // Use schema-validated spoiler
      headerImage,
      content: frontMatter.body,
    }
  },
})

export default defineConfig({
  collections: [posts],
})