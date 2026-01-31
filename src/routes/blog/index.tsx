import { createFileRoute, Link } from '@tanstack/react-router';
// @ts-expect-error - generated at build time
import { allPosts } from 'content-collections';

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

export const Route = createFileRoute('/blog/')({
  component: BlogIndex,
});

function BlogIndex() {
  // Posts are sorted by published date
  const sortedPosts = (allPosts as Array<Post>).sort(
    (a, b) => new Date(b.published).getTime() - new Date(a.published).getTime()
  );

  return (
    <div>
      <h1>Blog</h1>
      <ul>
        {sortedPosts.map(post => (
          <li key={post.slug}>
            <Link to="/blog/$slug" params={{ slug: post.slug }}>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
              <span>{post.published}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
