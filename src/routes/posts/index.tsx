import { ArrowRightIcon } from '@phosphor-icons/react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { allPosts } from 'content-collections';
import { format } from 'date-fns';
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

export const Route = createFileRoute('/posts/')({
  component: PostsIndex,
});

function PostsIndex() {
  // Posts are sorted by date
  const sortedPosts = (allPosts as Array<Post>)
    .filter(post => !post.group)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <>
      <blockquote className="mb-8 text-pretty border-l-2 pl-4 font-semibold text-foreground/65 text-lg italic dark:text-foreground/75">
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
          best options for the future.
          <br /> I call this approach "staying upwind." This is how most people
          who've done great work seem to have done it.
        </p>
      </blockquote>
      <h2 className="font-bold text-foreground/45 text-sm uppercase leading-loose tracking-wider">
        Recent Posts
      </h2>
      <div className="relative top-5 flex flex-col gap-8">
        {sortedPosts.map(post => (
          <Item
            key={post.slug}
            render={
              <Link
                to="/posts/$slug"
                viewTransition
                params={{ slug: post.slug }}
                className="grid scale-100 grid-cols-[1fr_auto] rounded-md px-4 py-4 transition-transform hover:scale-[1.005] hover:bg-muted active:scale-100"
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
