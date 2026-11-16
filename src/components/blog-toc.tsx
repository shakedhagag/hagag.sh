import { Drawer } from '@base-ui/react/drawer';
import { ListIcon } from '@phosphor-icons/react';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import type { TocItem } from '@/lib/mdx';
import { cn } from '@/lib/utils';

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

const MANUAL_SCROLL_EVENTS = ['wheel', 'touchmove', 'keydown'] as const;

export function BlogToc({ items }: { items: Array<TocItem> }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const heldUntilManualScroll = useRef<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (items.length === 0) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      if (!heldUntilManualScroll.current) setActiveId(getActiveId(items));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const release = () => {
      if (!heldUntilManualScroll.current) return;
      heldUntilManualScroll.current = null;
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

    heldUntilManualScroll.current = id;
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
        className="fixed inset-bs-1/2 inset-s-8 z-20 hidden max-h-[70dvh] w-56 -translate-y-1/2 overflow-y-auto overscroll-contain pe-3 xl:block"
      >
        <p className="mbe-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
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
                    'block text-sm transition-colors duration-150 active:text-foreground',
                    item.level === 3 && 'ps-3',
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
        <Drawer.Trigger
          aria-label="Table of contents"
          className="fixed inset-be-4 inset-e-4 z-120 rounded-full border border-border/70 bg-background/95 px-3 py-2 text-lg font-medium text-foreground shadow-sm backdrop-blur after:absolute after:inset-[min(0px,(100%-44px)/2)] active:scale-[0.97] motion-safe:transition-transform motion-safe:duration-150 motion-safe:ease-out xl:hidden"
        >
          <ListIcon />
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Backdrop className="fixed inset-0 z-30 bg-black/45 data-ending-style:opacity-0 data-starting-style:opacity-0 xl:hidden" />
          <Drawer.Popup className="fixed inset-x-0 inset-be-0 z-40 flex max-h-[75dvh] flex-col rounded-ss-md rounded-se-md border border-border/70 bg-background p-4 pbe-6 shadow-xl data-ending-style:translate-y-full data-starting-style:translate-y-full xl:hidden">
            <Drawer.Title className="mbe-3 flex-none text-xs font-medium tracking-widest text-muted-foreground uppercase">
              On this page
            </Drawer.Title>
            <ul className="min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain pe-1">
              {items.map(item => {
                const isActive = activeId === item.id;

                return (
                  <li key={`mobile-${item.id}`}>
                    <button
                      type="button"
                      className={cn(
                        'block w-full text-start text-sm transition-colors duration-150 active:text-foreground',
                        item.level === 3 && 'ps-3',
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
