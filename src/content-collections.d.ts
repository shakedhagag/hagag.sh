declare module 'content-collections' {
  type Post = {
    _meta: { path: string };
    title: string;
    date: string;
    spoiler: string;
    group?: string;
    customUrl?: string;
    slug: string;
    excerpt: string;
    headerImage?: string;
    content: string;
    markup: string;
    headings: Array<{ id: string; text: string; level: number }>;
  };

  export const allPosts: Array<Post>;
}
