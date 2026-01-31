import { createFileRoute, notFound } from '@tanstack/react-router';
// @ts-expect-error - generated at build time
import { allPosts } from 'content-collections';
import { Markdown } from '@/components/markdown';

type Post = {
  _meta: { path: string };
  title: string;
  published: string;
  description?: string;
  authors: Array<string>;
  slug: string;
  excerpt: string;
  headerImage?: string;
  content: string;
};

export const Route = createFileRoute('/blog/$slug')({
  loader: ({ params }: { params: { slug: string } }) => {
    const post = (allPosts as Array<Post>).find(p => p.slug === params.slug);
    if (!post) {
      throw notFound();
    }
    return post;
  },
  component: BlogPost,
});

function BlogPost() {
  const post = Route.useLoaderData();

  return (
    <article>
      <header>
        <h1>{post.title}</h1>
        <p>
          By {post.authors.join(', ')} on {post.published}
        </p>
      </header>
      <Markdown content={post.content} className="prose" />
    </article>
  );
}
