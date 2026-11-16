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
        'pointer-events-none fixed inset-x-0 inset-be-0 isolate z-1 h-24',
        'bg-background/90 backdrop-blur-xs',
        'transform-[translateZ(0)] will-change-transform',
        'mask-[linear-gradient(to_bottom,transparent,black)]',
        className
      )}
    />
  );
}
