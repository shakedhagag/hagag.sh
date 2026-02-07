import { createFileRoute, Link } from '@tanstack/react-router';
import { allPosts } from 'content-collections';
import { Header } from '@/components/Header';

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

export const Route = createFileRoute('/blog/')({
  component: BlogIndex,
});

function BlogIndex() {
  // Posts are sorted by date
  const sortedPosts = (allPosts as Array<Post>)
    .filter(post => !post.group)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <Header />
      <blockquote className="mb-8 border-l-2 pl-4 font-semibold text-foreground/65 text-lg italic dark:text-foreground/75">
        <svg
          className="mb-2 h-4 w-4 text-muted-foreground/60"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 18 14"
        >
          <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" />
        </svg>
        <p className="font-normal">
          At each stage do whatever seems most interesting and gives you the
          best options for the future. I call this approach "staying upwind."
          This is how most people who've done great work seem to have done it.
        </p>
      </blockquote>
      <h2 className="font-bold text-foreground/45 text-sm uppercase leading-loose tracking-wider">
        Recent Posts
      </h2>
      <div className="relative top-5 flex flex-col gap-8">
        {sortedPosts.map(post => (
          <Link
            key={post.slug}
            to="/blog/$slug"
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
    </div>
  );
}
