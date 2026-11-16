const SITE_URL = 'https://hagag.sh';
export const SITE_NAME = 'hagag.sh';
export const SITE_DESCRIPTION =
  'Notes on TypeScript, React, Rust, and the tools I use every day.';

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).href;
}
