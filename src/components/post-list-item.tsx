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
    // One link in the title; its ::after covers the card, so the whole card
    // is clickable while a screen reader announces only the title.
    <Item className="relative grid grid-cols-[1fr_auto] rounded-md hover:scale-[1.005] hover:bg-muted active:scale-[0.98] has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50 motion-safe:transition-[background-color,scale] motion-safe:duration-150 motion-safe:ease-out">
      <ItemContent>
        <ItemTitle
          className={cn(
            // Paint the title (and the link's overlay) above the date, which
            // is its own stacking context through view-transition-name.
            'z-1 [view-transition-name:var(--post-title-transition)]',
            titleClassName
          )}
          style={getPostTitleTransitionStyle(post.slug)}
        >
          <Link
            to="/posts/$slug"
            params={{ slug: post.slug }}
            viewTransition
            className="outline-hidden after:absolute after:inset-0 after:rounded-[inherit]"
          >
            {post.title}
          </Link>
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
        <ArrowRightIcon weight="bold" className="size-4" aria-hidden />
      </ItemActions>
    </Item>
  );
}
