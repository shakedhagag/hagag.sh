import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"

import { cn } from "@/lib/utils"

function Separator({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorPrimitive.Props) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(
        "shagag:shrink-0 shagag:bg-border shagag:data-horizontal:h-px shagag:data-horizontal:w-full shagag:data-vertical:w-px shagag:data-vertical:self-stretch",
        className
      )}
      {...props}
    />
  )
}

export { Separator }
