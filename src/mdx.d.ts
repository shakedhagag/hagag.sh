declare module '*.mdx' {
  import type { MDXModule } from '@/lib/mdx';

  export const toc: MDXModule['toc'];

  const MDXContent: MDXModule['default'];
  export default MDXContent;
}
