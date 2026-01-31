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
