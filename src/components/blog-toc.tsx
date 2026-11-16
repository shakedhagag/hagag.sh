import { Drawer } from '@base-ui/react/drawer';
import { ListIcon } from '@phosphor-icons/react';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import type { TocItem } from '@/lib/mdx';
import { cn } from '@/lib/utils';

// A heading becomes active once its top scrolls above this line. Kept close
// to the top so the heading you jump to from the TOC is the one highlighted.
const ACTIVE_LINE_PX = 100;

function getActiveId(items: Array<TocItem>) {
  const scrolledToBottom =
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - 2;
  if (scrolledToBottom) return items.at(-1)?.id ?? null;

  let active: string | null = null;
  for (const item of items) {
    const heading = document.getElementById(item.id);
    if (!heading) continue;
    if (heading.getBoundingClientRect().top > ACTIVE_LINE_PX) break;
    active = item.id;
  }
  return active;
}

// Input that means the reader is scrolling by hand again.
const MANUAL_SCROLL_EVENTS = ['wheel', 'touchmove', 'keydown'] as const;

export function BlogToc({ items }: { items: Array<TocItem> }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  // A heading picked from the TOC stays active through the smooth scroll to
  // it (instead of every heading on the way lighting up in turn) and after
  // it, until the reader scrolls by hand.
  const pickedId = useRef<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (items.length === 0) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      if (!pickedId.current) setActiveId(getActiveId(items));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const release = () => {
      if (!pickedId.current) return;
      pickedId.current = null;
      schedule();
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    for (const event of MANUAL_SCROLL_EVENTS) {
      window.addEventListener(event, release, { passive: true });
    }
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      for (const event of MANUAL_SCROLL_EVENTS) {
        window.removeEventListener(event, release);
      }
    };
  }, [items]);

  function handleSelectHeading(id: string, closeMobile = false) {
    const heading = document.getElementById(id);
    if (!heading) return;

    pickedId.current = id;
    setActiveId(id);

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    heading.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    });

    navigate({
      hash: id,
      replace: true,
      resetScroll: false,
      hashScrollIntoView: false,
      viewTransition: false,
    });

    if (closeMobile) {
      setMobileOpen(false);
    }
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <nav
        aria-label="Table of contents"
        className="fixed top-1/2 left-8 z-20 hidden max-h-[70vh] w-56 -translate-y-1/2 overflow-y-auto pr-3 xl:block"
      >
        <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          On this page
        </p>
        <ul className="space-y-1">
          {items.map(item => {
            const isActive = activeId === item.id;

            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={cn(
                    'block text-sm transition-colors duration-150 motion-reduce:transition-none',
                    item.level === 3 && 'pl-3',
                    isActive
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                  onClick={event => {
                    event.preventDefault();
                    handleSelectHeading(item.id);
                  }}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <Drawer.Root open={mobileOpen} onOpenChange={setMobileOpen}>
        <Drawer.Trigger className="fixed right-4 bottom-4 z-120 rounded-full border border-border/70 bg-background/95 px-3 py-2 text-lg font-medium text-foreground shadow-sm backdrop-blur xl:hidden">
          <ListIcon />
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Backdrop className="fixed inset-0 z-30 bg-black/45 data-ending-style:opacity-0 data-starting-style:opacity-0 xl:hidden" />
          <Drawer.Popup className="fixed inset-x-0 bottom-0 z-40 max-h-[75vh] rounded-t-md border border-border/70 bg-background p-4 pb-6 shadow-xl data-ending-style:translate-y-full data-starting-style:translate-y-full xl:hidden">
            <Drawer.Title className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
              On this page
            </Drawer.Title>
            <ul className="max-h-[60vh] space-y-2 overflow-y-auto pr-1">
              {items.map(item => {
                const isActive = activeId === item.id;

                return (
                  <li key={`mobile-${item.id}`}>
                    <button
                      type="button"
                      className={cn(
                        'block w-full text-left text-sm transition-colors duration-150 motion-reduce:transition-none',
                        item.level === 3 && 'pl-3',
                        isActive
                          ? 'text-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                      onClick={() => handleSelectHeading(item.id, true)}
                    >
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </Drawer.Popup>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}
