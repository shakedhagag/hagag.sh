import { createFileRoute } from '@tanstack/react-router';
import { format } from 'date-fns';
import { PostListItem } from '@/components/post-list-item';
import { Separator } from '@/components/ui/separator';
import { canonical } from '@/lib/head';
import { getListedPosts, type PostSummary } from '@/lib/posts';

export const Route = createFileRoute('/posts/')({
  head: () => canonical('/posts'),
  component: PostsIndex,
});

function groupPostsByYear(posts: Array<PostSummary>) {
  return posts.reduce<Array<{ year: string; posts: Array<PostSummary> }>>(
    (groups, post) => {
      const year = format(post.date, 'yyyy');
      const currentGroup = groups.at(-1);

      if (currentGroup?.year === year) {
        currentGroup.posts.push(post);
        return groups;
      }

      groups.push({ year, posts: [post] });
      return groups;
    },
    []
  );
}

function PostsIndex() {
  const groupedPosts = groupPostsByYear(getListedPosts());

  return (
    <>
      <blockquote className="mb-8 border-l-2 pl-4 text-lg font-semibold text-pretty text-foreground/65 italic dark:text-foreground/75">
        <svg
          className="mb-2 size-4 text-muted-foreground/60"
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
      <h2 className="text-sm leading-loose font-semibold tracking-wider text-foreground/45 uppercase">
        Recent Posts
      </h2>
      <div className="relative top-5 flex flex-col gap-10">
        {groupedPosts.map((group, index) => (
          <section key={group.year} className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <h3 className="shrink-0 text-xs leading-loose font-semibold tracking-wider text-foreground/45 uppercase">
                {group.year}
              </h3>
              {index > 0 ? <Separator className="flex-1" /> : null}
            </div>
            <div className="flex flex-col gap-8">
              {group.posts.map(post => (
                <PostListItem
                  key={post.slug}
                  post={post}
                  titleClassName="text-lg"
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
