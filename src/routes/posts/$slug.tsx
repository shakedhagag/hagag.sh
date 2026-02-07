import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { allPosts } from 'content-collections';
import { Markdown } from '@/components/markdown';

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

    return {
      type: 'post' as const,
      post,
    };
  },
  component: BlogPostOrGroup,
});

const whitespaceRegex = /\s+/ as RegExp;

function BlogPostOrGroup() {
  const data = Route.useLoaderData();

  if (data.type === 'group') {
    const { group, posts } = data;
    return (
      <>
        <h2 className="font-bold text-foreground/45 text-sm uppercase leading-loose tracking-wider">
          {group.charAt(0).toUpperCase() + group.slice(1).replace(/-/g, ' ')}
        </h2>
        <div className="relative top-5 flex flex-col gap-8">
          {posts.map(post => (
            <Link
              key={post.slug}
              to="/posts/$slug"
              params={{ slug: post.slug }}
              className="block scale-100 rounded-md px-4 py-4 transition-transform hover:scale-[1.005] hover:bg-muted active:scale-100"
            >
              <article>
                <h2 className="font-semibold text-foreground text-lg">
                  {post.title}
                </h2>
                <p className="mt-1 text-muted-foreground">{post.spoiler}</p>
              </article>
            </Link>
          ))}
        </div>
      </>
    );
  }

  const post = data.post;
  const wordCount = post.content.split(whitespaceRegex).length;
  const readTime = Math.ceil(wordCount / 200);

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <article>
      <div className="flex justify-between">
        <h1 className="font-semibold text-3xl text-foreground">{post.title}</h1>
        <p className="mt-2 mb-6 text-right text-muted-foreground text-sm">
          {formattedDate}
        </p>
      </div>
      <div className="mt-2 flex flex-col">
        <p className="mt-2 text-[13px] text-muted-foreground/50">
          word count：{wordCount}
        </p>
        <p className="mt-2 text-[13px] text-muted-foreground/50">
          estimated reading time：{readTime}{' '}
          {readTime === 1 ? 'minute' : 'minutes'}
        </p>
      </div>
      <Markdown content={post.content} className="markdown mt-10" />
    </article>
  );
}
