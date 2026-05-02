import { cn } from '@/lib/utils';

type BottomBlurGradientMaskProps = {
  className?: string;
};

export function BottomBlurGradientMask({
  className,
}: BottomBlurGradientMaskProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none fixed right-0 bottom-0 isolate z-1 h-24 w-full',
        'backdrop-blur-xs transition-[background] duration-300 ease-in-out',
        'transform-[translateZ(0)] will-change-transform',
        'bg-[oklch(from_var(--background)_l_c_h/90%)]',
        'mask-[linear-gradient(to_bottom,rgba(0,0,0,0)_0%,black_100%)]',
        className
      )}
    />
  );
}
