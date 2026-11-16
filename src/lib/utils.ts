import type { CSSProperties } from 'react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs));
}

function getPostTitleTransitionName(slug: string) {
  return `post-title-${slug.replace(/[^a-zA-Z0-9_-]/g, '-')}`;
}

export function getPostTitleTransitionStyle(
  slug: string
): CSSProperties & Record<'--post-title-transition', string> {
  return {
    '--post-title-transition': getPostTitleTransitionName(slug),
  };
}

function getPostDateTransitionName(slug: string) {
  return `post-date-${slug.replace(/[^a-zA-Z0-9_-]/g, '-')}`;
}

export function getPostDateTransitionStyle(
  slug: string
): CSSProperties & Record<'--post-date-transition', string> {
  return {
    '--post-date-transition': getPostDateTransitionName(slug),
  };
}
