declare module 'virtual:post-preloads' {
  /** Post slug -> URLs of its client chunks (empty outside the server build). */
  const preloads: Record<string, Array<string>>;
  export default preloads;
}
