import type { ComponentType } from 'react';

export type TocItem = {
  id: string;
  label: string;
  level: 2 | 3;
};

export type MDXComponents = Record<string, ComponentType<any>>;

/** What each compiled post exports (see src/mdx.d.ts). */
export type MDXModule = {
  default: ComponentType<{ components?: MDXComponents }>;
  toc: Array<TocItem>;
};
