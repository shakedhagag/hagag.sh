import geistMonoFont from '@fontsource/geist-mono/files/geist-mono-latin-400-normal.woff2?url';
import { createFileRoute, notFound } from '@tanstack/react-router';
import { format } from 'date-fns';
import { Suspense, use } from 'react';
import postPreloads from 'virtual:post-preloads';
import { BlogToc } from '@/components/blog-toc';
import { BottomBlurGradientMask } from '@/components/bottom-blur-gradient-mask';
import { mdxComponents } from '@/components/mdx-components';
import { PostListItem } from '@/components/post-list-item';
import { fontPreload, shareMeta } from '@/lib/head';
import { getLoadedPostModule, loadPostModule } from '@/lib/post-modules';
import { getGroup, getPost } from '@/lib/posts';
import { postCard } from '@/lib/share-cards';
import {
  getPostDateTransitionStyle,
  getPostTitleTransitionStyle,
} from '@/lib/utils';

export const Route = createFileRoute('/posts/$slug')({
  loader: async ({ params: { slug } }) => {
    const group = getGroup(slug);
    if (group) return { type: 'group' as const, ...group };

    const post = getPost(slug);
    if (!post) throw notFound();

    const { toc } = await loadPostModule(slug);
    return {
      type: 'post' as const,
      card: postCard(post),
      post,
      toc,
      preloads: postPreloads[slug] ?? [],
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    if (loaderData.type === 'group')
      return { meta: shareMeta(loaderData.card) };

    return {
      meta: shareMeta(loaderData.card, { type: 'article' }),
      links: [
        fontPreload(geistMonoFont),
        ...loaderData.preloads.map(href => ({ rel: 'modulepreload', href })),
      ],
    };
  },
  component: BlogPostOrGroup,
});

function PostBody({ slug }: { slug: string }) {
  // Loaded by the route loader on the server and on client navigations.
  // On first hydration the chunk may still be in flight: suspending here
  // keeps the server HTML on screen until it arrives.
  const { default: Content } =
    getLoadedPostModule(slug) ?? use(loadPostModule(slug));
  return <Content components={mdxComponents} />;
}

function BlogPostOrGroup() {
  const data = Route.useLoaderData();

  if (data.type === 'group') {
    return (
      <>
        <h2 className="text-sm leading-loose font-semibold tracking-wider text-card-foreground uppercase">
          {data.card.title}
        </h2>
        <div className="relative top-5 flex flex-col gap-8">
          {data.posts.map(post => (
            <PostListItem key={post.slug} post={post} />
          ))}
        </div>
      </>
    );
  }

  const { post } = data;

  return (
    <>
      <BlogToc items={data.toc} />
      <article className="mb-10">
        <div className="flex flex-col">
          <h1
            className="text-3xl font-semibold text-card-foreground [view-transition-name:var(--post-title-transition)]"
            style={getPostTitleTransitionStyle(post.slug)}
          >
            {post.title}
          </h1>
          <p
            className="mt-2 mb-4 text-left text-sm text-muted-foreground [view-transition-name:var(--post-date-transition)]"
            style={getPostDateTransitionStyle(post.slug)}
          >
            {format(new Date(post.date), 'MMMM d, yyyy')}
          </p>
        </div>
        <div className="markdown prose mt-10 prose-blog">
          <Suspense fallback={null}>
            <PostBody slug={post.slug} />
          </Suspense>
        </div>
      </article>
      <BottomBlurGradientMask />
    </>
  );
}
