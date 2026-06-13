import { ArrowRightIcon } from '@phosphor-icons/react';
import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { allPosts } from 'content-collections';
import { format } from 'date-fns';
import { BottomBlurGradientMask } from '@/components/bottom-blur-gradient-mask';
import { mdxComponents } from '@/components/mdx-components';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemTitle,
} from '@/components/ui/item';
import {
  getPostDateTransitionStyle,
  getPostTitleTransitionStyle,
} from '@/lib/utils';

const postModules = import.meta.glob<{
  default: React.ComponentType<{
    components?: Record<string, React.ComponentType<any>>;
  }>;
}>('/src/blog/**/*.mdx', { eager: true });

type Post = {
  _meta: { path: string };
  title: string;
  date: string;
  spoiler: string;
  group?: string;
  customUrl?: string;
  slug: string;
  excerpt: string;
  headerImage?: string;
  content: string;
};

export const Route = createFileRoute('/posts/$slug')({
  loader: ({ params }: { params: { slug: string } }) => {
    // First check if it's a group
    const groupedPosts = (allPosts as Array<Post>).filter(
      post => post.group === params.slug
    );

    if (groupedPosts.length > 0) {
      return {
        type: 'group' as const,
        group: params.slug,
        posts: groupedPosts.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        ),
      };
    }

    // Otherwise check if it's a post
    const post = (allPosts as Array<Post>).find(p => p.slug === params.slug);
    if (!post) {
      throw notFound();
    }

    const contentPath = `/src/blog/${post._meta.path}.mdx`;
    if (!postModules[contentPath]) {
      throw notFound();
    }

    return {
      type: 'post' as const,
      contentPath,
      post,
    };
  },
  component: BlogPostOrGroup,
});

function BlogPostOrGroup() {
  const data = Route.useLoaderData();

  if (data.type === 'group') {
    const { group, posts } = data;
    return (
      <>
        <h2 className="font-semibold text-card-foreground text-sm uppercase leading-loose tracking-wider">
          {group.charAt(0).toUpperCase() + group.slice(1).replace(/-/g, ' ')}
        </h2>
        <div className="relative top-5 flex flex-col gap-8">
          {posts.map(post => (
            <Item
              key={post.slug}
              render={
                <Link
                  to="/posts/$slug"
                  params={{ slug: post.slug }}
                  viewTransition
                  className="grid scale-100 grid-cols-[1fr_auto] rounded-md p-4 transition-transform hover:scale-[1.005] hover:bg-muted active:scale-100"
                >
                  <ItemContent>
                    <ItemTitle
                      className="[view-transition-name:var(--post-title-transition)]"
                      style={getPostTitleTransitionStyle(post.slug)}
                    >
                      {post.title}
                    </ItemTitle>
                    <ItemDescription className="text-pretty text-foreground/75 text-sm">
                      {post.spoiler}
                    </ItemDescription>
                    <ItemFooter
                      className="text-foreground/45 text-xs leading-loose tracking-widest [view-transition-name:var(--post-date-transition)]"
                      style={getPostDateTransitionStyle(post.slug)}
                    >
                      {format(post.date, 'MMMM dd, yyyy')}
                    </ItemFooter>
                  </ItemContent>
                  <ItemActions>
                    <ArrowRightIcon weight="bold" className="size-4" />
                  </ItemActions>
                </Link>
              }
            />
          ))}
        </div>
      </>
    );
  }

  const post = data.post;
  const PostContent = postModules[data.contentPath]?.default;

  const formattedDate = format(new Date(post.date), 'MMMM d, yyyy');

  return (
    <>
      <article className="mb-10">
        <div className="flex flex-col">
          <h1
            className="font-semibold text-3xl text-card-foreground [view-transition-name:var(--post-title-transition)]"
            style={getPostTitleTransitionStyle(post.slug)}
          >
            {post.title}
          </h1>
          <p
            className="mt-2 mb-4 text-left text-muted-foreground text-sm [view-transition-name:var(--post-date-transition)]"
            style={getPostDateTransitionStyle(post.slug)}
          >
            {formattedDate}
          </p>
        </div>
        <div className="markdown prose prose-blog mt-10">
          {PostContent ? <PostContent components={mdxComponents} /> : null}
        </div>
      </article>
      <BottomBlurGradientMask />
    </>
  );
}
