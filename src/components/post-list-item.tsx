import { ArrowRightIcon } from '@phosphor-icons/react';
import { Link } from '@tanstack/react-router';
import { format } from 'date-fns';
import type { PostSummary } from '@/lib/posts';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemTitle,
} from '@/components/ui/item';
import {
  cn,
  getPostDateTransitionStyle,
  getPostTitleTransitionStyle,
} from '@/lib/utils';

export function PostListItem({
  post,
  titleClassName,
}: {
  post: PostSummary;
  titleClassName?: string;
}) {
  return (
    <Item
      render={
        <Link
          to="/posts/$slug"
          params={{ slug: post.slug }}
          viewTransition
          className="grid scale-100 grid-cols-[1fr_auto] rounded-md p-4 transition-transform hover:scale-[1.005] hover:bg-muted active:scale-100"
        >
          <ItemContent>
            <ItemTitle
              className={cn(
                '[view-transition-name:var(--post-title-transition)]',
                titleClassName
              )}
              style={getPostTitleTransitionStyle(post.slug)}
            >
              {post.title}
            </ItemTitle>
            <ItemDescription className="text-sm text-pretty text-foreground/75">
              {post.spoiler}
            </ItemDescription>
            <ItemFooter
              className="text-xs leading-loose tracking-widest text-foreground/45 [view-transition-name:var(--post-date-transition)]"
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
  );
}
