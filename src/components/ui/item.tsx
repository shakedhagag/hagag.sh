import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

function ItemGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="list"
      data-slot="item-group"
      className={cn(
        "shagag:group/item-group shagag:flex shagag:w-full shagag:flex-col shagag:gap-4 shagag:has-data-[size=sm]:gap-2.5 shagag:has-data-[size=xs]:gap-2",
        className
      )}
      {...props}
    />
  )
}

function ItemSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="item-separator"
      orientation="horizontal"
      className={cn("shagag:my-2", className)}
      {...props}
    />
  )
}

const itemVariants = cva(
  "shagag:group/item shagag:flex shagag:w-full shagag:flex-wrap shagag:items-center shagag:rounded-2xl shagag:border shagag:text-sm shagag:transition-colors shagag:duration-100 shagag:outline-none shagag:focus-visible:border-ring shagag:focus-visible:ring-[3px] shagag:focus-visible:ring-ring/50 shagag:[a]:transition-colors shagag:[a]:hover:bg-muted",
  {
    variants: {
      variant: {
        default: "shagag:border-transparent",
        outline: "shagag:border-border",
        muted: "shagag:border-transparent shagag:bg-muted/50",
      },
      size: {
        default: "shagag:gap-3.5 shagag:px-4 shagag:py-3.5",
        sm: "shagag:gap-3.5 shagag:px-3.5 shagag:py-3",
        xs: "shagag:gap-2.5 shagag:px-3 shagag:py-2.5 shagag:in-data-[slot=dropdown-menu-content]:p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Item({
  className,
  variant = "default",
  size = "default",
  render,
  ...props
}: useRender.ComponentProps<"div"> & VariantProps<typeof itemVariants>) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(itemVariants({ variant, size, className })),
      },
      props
    ),
    render,
    state: {
      slot: "item",
      variant,
      size,
    },
  })
}

const itemMediaVariants = cva(
  "shagag:flex shagag:shrink-0 shagag:items-center shagag:justify-center shagag:gap-2 shagag:group-has-data-[slot=item-description]/item:translate-y-0.5 shagag:group-has-data-[slot=item-description]/item:self-start shagag:[&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "shagag:bg-transparent",
        icon: "shagag:[&_svg:not([class*=size-])]:size-4",
        image:
          "shagag:size-10 shagag:overflow-hidden shagag:rounded-xl shagag:group-data-[size=sm]/item:size-8 shagag:group-data-[size=xs]/item:size-6 shagag:group-data-[size=xs]/item:rounded-lg shagag:[&_img]:size-full shagag:[&_img]:object-cover",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function ItemMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof itemMediaVariants>) {
  return (
    <div
      data-slot="item-media"
      data-variant={variant}
      className={cn(itemMediaVariants({ variant, className }))}
      {...props}
    />
  )
}

function ItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-content"
      className={cn(
        "shagag:flex shagag:flex-1 shagag:flex-col shagag:gap-1 shagag:group-data-[size=xs]/item:gap-0.5 shagag:[&+[data-slot=item-content]]:flex-none",
        className
      )}
      {...props}
    />
  )
}

function ItemTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-title"
      className={cn(
        "shagag:line-clamp-1 shagag:flex shagag:w-fit shagag:items-center shagag:gap-2 shagag:text-sm shagag:leading-snug shagag:font-medium shagag:underline-offset-4",
        className
      )}
      {...props}
    />
  )
}

function ItemDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="item-description"
      className={cn(
        "shagag:line-clamp-2 shagag:text-start shagag:text-sm shagag:font-normal shagag:text-muted-foreground shagag:[&>a]:underline shagag:[&>a]:underline-offset-4 shagag:[&>a:hover]:text-primary",
        className
      )}
      {...props}
    />
  )
}

function ItemActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-actions"
      className={cn("shagag:flex shagag:items-center shagag:gap-2", className)}
      {...props}
    />
  )
}

function ItemHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-header"
      className={cn(
        "shagag:flex shagag:basis-full shagag:items-center shagag:justify-between shagag:gap-2",
        className
      )}
      {...props}
    />
  )
}

function ItemFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-footer"
      className={cn(
        "shagag:flex shagag:basis-full shagag:items-center shagag:justify-between shagag:gap-2",
        className
      )}
      {...props}
    />
  )
}

export {
  Item,
  ItemMedia,
  ItemContent,
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  ItemDescription,
  ItemHeader,
  ItemFooter,
}
