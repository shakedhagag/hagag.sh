// content-collections.ts
import { defineCollection, defineConfig } from '@content-collections/core'
import { compileMDX } from '@content-collections/mdx'
import { z } from 'zod'
import matter from 'gray-matter'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'

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
  transform: async ({ content, ...post }, context) => {
    const frontMatter = extractFrontMatter(content)
    const mdx = await compileMDX(context, { ...post, content: frontMatter.body }, {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'wrap',
            properties: { className: ['anchor'] },
          },
        ],
        [
          rehypePrettyCode,
          {
            theme: {
              dark: 'github-dark',
              light: 'github-light',
            },
            defaultLang: 'text',
          },
        ],
      ],
    })

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
      mdx,
    }
  },
})

export default defineConfig({
  collections: [posts],
})
