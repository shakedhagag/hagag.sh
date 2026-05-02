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
  };

  export const allPosts: Array<Post>;
}
