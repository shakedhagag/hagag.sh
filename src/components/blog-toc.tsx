import { Drawer } from '@base-ui/react/drawer';
import { useNavigate } from '@tanstack/react-router';
import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type TocItem = {
  id: string;
  label: string;
  level: 2 | 3;
};

const TOC_IO_ROOT_MARGIN = '0% 0% -80% 0%';
const HEADING_HASH_PREFIX_REGEX = /^#/;

export function BlogToc({ contentKey }: { contentKey: string }) {
  const [items, setItems] = useState<Array<TocItem>>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const navigate = useNavigate();

  useEffect(() => {
    const root = document.querySelector('[data-post-content]');
    if (!root) {
      setItems([]);
      return;
    }

    const headings = Array.from(
      root.querySelectorAll('h2[id], h3[id]')
    ) as Array<HTMLHeadingElement>;

    setItems(
      headings.map(heading => ({
        id: heading.id,
        label:
          heading.querySelector('.heading-link')?.textContent?.trim() ??
          heading.textContent?.replace(HEADING_HASH_PREFIX_REGEX, '').trim() ??
          heading.id,
        level: heading.tagName.toLowerCase() === 'h3' ? 3 : 2,
      }))
    );
  }, [contentKey]);

  useEffect(() => {
    if (items.length === 0) {
      setActiveId(null);
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: TOC_IO_ROOT_MARGIN, threshold: 0 }
    );

    items.forEach(item => {
      const heading = document.getElementById(item.id);
      if (heading) observer.observe(heading);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <nav
        aria-label="Table of contents"
        className="fixed top-1/2 left-8 z-20 hidden max-h-[70vh] w-56 -translate-y-1/2 overflow-y-auto pr-3 xl:block"
      >
        <p className="mb-3 font-medium text-muted-foreground text-xs uppercase tracking-widest">
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
                    'block text-sm transition-colors',
                    item.level === 3 && 'pl-3',
                    isActive
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                  onClick={event => {
                    event.preventDefault();

                    const heading = document.getElementById(item.id);
                    if (!heading) return;

                    heading.scrollIntoView({
                      behavior: reduceMotion ? 'auto' : 'smooth',
                      block: 'start',
                    });

                    navigate({
                      hash: item.id,
                      replace: true,
                      resetScroll: false,
                      hashScrollIntoView: false,
                      viewTransition: false,
                    });
                    setActiveId(item.id);
                  }}
                >
                  <motion.span
                    initial={false}
                    animate={{
                      color: isActive
                        ? 'var(--color-foreground)'
                        : 'var(--color-muted-foreground)',
                    }}
                    transition={{ duration: reduceMotion ? 0 : 0.12 }}
                  >
                    {item.label}
                  </motion.span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <Drawer.Root open={mobileOpen} onOpenChange={setMobileOpen}>
        <Drawer.Trigger className="fixed right-4 bottom-4 z-20 rounded-full border border-border/70 bg-background/95 px-4 py-2 font-medium text-foreground text-sm shadow-sm backdrop-blur xl:hidden">
          On this page
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Backdrop className="fixed inset-0 z-30 bg-black/45 data-ending-style:opacity-0 data-starting-style:opacity-0 xl:hidden" />
          <Drawer.Popup className="fixed inset-x-0 bottom-0 z-40 max-h-[75vh] rounded-t-md border border-border/70 bg-background p-4 pb-6 shadow-xl data-ending-style:translate-y-full data-starting-style:translate-y-full xl:hidden">
            <Drawer.Title className="mb-3 font-medium text-muted-foreground text-xs uppercase tracking-widest">
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
                        'block w-full text-left text-sm transition-colors',
                        item.level === 3 && 'pl-3',
                        isActive
                          ? 'text-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                      onClick={() => {
                        const heading = document.getElementById(item.id);
                        if (!heading) return;

                        heading.scrollIntoView({
                          behavior: reduceMotion ? 'auto' : 'smooth',
                          block: 'start',
                        });

                        navigate({
                          hash: item.id,
                          replace: true,
                          resetScroll: false,
                          hashScrollIntoView: false,
                          viewTransition: false,
                        });
                        setActiveId(item.id);
                        setMobileOpen(false);
                      }}
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
