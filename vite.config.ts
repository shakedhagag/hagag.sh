// vp migrate: merged .oxlintrc.json (5847ee0864ffd64379961fa86b9ffd78).
import { cloudflare } from '@cloudflare/vite-plugin';
import contentCollections from '@content-collections/vite';
import mdx from '@mdx-js/rollup';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import { defineConfig, lazyPlugins } from 'vite-plus';
import { ogImages } from './plugins/og-images';
import { postPreloads } from './plugins/post-preloads';
import { rehypeExportToc } from './plugins/rehype-export-toc';

// Vite's dep scanner can't parse .mdx, so components that posts import are
// invisible to it and their deps get discovered mid-request. In the SSR env
// that re-optimization leaves a stale React copy and SSR falls back to client
// rendering. Scanning the demos directly finds them up front.
const POST_COMPONENT_ENTRIES = ['src/components/demos/**/*.tsx'];

const config = defineConfig({
  test: {
    passWithNoTests: true,
  },
  fmt: {
    useTabs: false,
    tabWidth: 2,
    printWidth: 80,
    endOfLine: 'lf',
    singleQuote: true,
    jsxSingleQuote: false,
    quoteProps: 'as-needed',
    trailingComma: 'es5',
    semi: true,
    arrowParens: 'avoid',
    bracketSameLine: false,
    bracketSpacing: true,
    singleAttributePerLine: false,
    sortTailwindcss: {
      stylesheet: './src/styles/globals.css',
      functions: [
        'cva',
        'classNames',
        'classnames',
        'classes',
        'clsx',
        'cn',
        'cx',
        'twMerge',
      ],
    },
    sortPackageJson: {
      sortScripts: true,
    },
    ignorePatterns: [
      '**/*.json',
      '!**/package.json',
      '**/*.jsonc',
      '**/*.css',
      '**/*.md',
      '**/*.mdx',
      '**/*.html',
      '**/*.gen.ts',
      'public/**',
    ],
    sortImports: {
      newlinesBetween: false,
      groups: [
        'type-import',
        ['value-builtin', 'value-external'],
        'type-internal',
        'value-internal',
        ['type-parent', 'type-sibling', 'type-index'],
        ['value-parent', 'value-sibling', 'value-index'],
        'unknown',
      ],
    },
  },
  lint: {
    plugins: ['typescript', 'react', 'jsx-a11y', 'unicorn', 'import', 'oxc'],
    categories: {
      correctness: 'off',
    },
    options: {
      typeAware: true,
      typeCheck: true,
    },
    rules: {
      'jsx-a11y/role-has-required-aria-props': 'error',
      'jsx-a11y/role-supports-aria-props': 'error',
      'typescript/no-unnecessary-type-constraint': 'error',
      'typescript/no-unnecessary-type-conversion': 'error',
      'typescript/no-useless-empty-export': 'error',
      'no-regex-spaces': 'error',
      'prefer-rest-params': 'error',
      'no-sequences': 'off',
      'no-extra-boolean-cast': 'error',
      'no-useless-catch': 'error',
      'no-useless-constructor': 'error',
      'no-lone-blocks': 'error',
      'no-useless-rename': 'error',
      'no-unneeded-ternary': 'error',
      'unicorn/no-useless-undefined': ['error'],
      'dot-notation': 'error',
      'prefer-regex-literals': 'error',
      'eslint/arrow-body-style': 'error',
      'react/jsx-no-useless-fragment': ['error'],
      'react/no-children-prop': 'error',
      'no-const-assign': 'error',
      'no-empty-character-class': 'off',
      'no-empty-pattern': 'error',
      'no-obj-calls': 'error',
      'constructor-super': 'error',
      'no-loss-of-precision': 'error',
      'no-self-assign': 'error',
      'no-case-declarations': 'error',
      'no-unreachable': 'error',
      'no-this-before-super': 'error',
      'no-unsafe-finally': 'error',
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'react/exhaustive-deps': 'off',
      'react/rules-of-hooks': 'error',
      'use-isnan': 'error',
      'valid-typeof': 'error',
      'no-eval': 'error',
      'typescript/prefer-as-const': 'error',
      'no-restricted-globals': [
        'error',
        {
          name: 'self',
          message: 'Use `globalThis` instead.',
        },
        {
          name: 'global',
          message: 'Use `globalThis` instead.',
        },
      ],
      yoda: 'error',
      'no-array-constructor': 'error',
      'typescript/array-type': [
        'error',
        {
          default: 'generic',
        },
      ],
      'prefer-const': ['error'],
      'prefer-exponentiation-operator': 'error',
      'typescript/consistent-type-imports': ['error'],
      'unicorn/prefer-node-protocol': 'error',
      'prefer-template': 'error',
      'unicorn/throw-new-error': 'error',
      'react/self-closing-comp': 'error',
      'typescript/consistent-type-definitions': ['error', 'type'],
      'no-alert': 'error',
      'react/no-array-index-key': 'off',
      'no-async-promise-executor': 'error',
      'no-ex-assign': 'error',
      'no-class-assign': 'error',
      'no-compare-neg-zero': 'error',
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error'],
        },
      ],
      'no-control-regex': 'error',
      'no-debugger': 'error',
      eqeqeq: ['error', 'always'],
      'no-duplicate-case': 'error',
      'typescript/no-dupe-class-members': 'error',
      'react/jsx-no-duplicate-props': 'warn',
      'no-dupe-keys': 'error',
      'no-empty': 'error',
      'no-empty-function': 'error',
      'import/no-namespace': 'error',
      'no-fallthrough': 'error',
      'no-func-assign': 'error',
      'no-global-assign': 'error',
      'no-import-assign': 'error',
      'no-irregular-whitespace': 'error',
      'no-misleading-character-class': 'error',
      'no-prototype-builtins': 'error',
      'no-redeclare': 'error',
      'no-self-compare': 'error',
      'no-shadow-restricted-names': 'error',
      'no-sparse-arrays': 'error',
      'no-template-curly-in-string': 'error',
      'no-unsafe-negation': 'error',
      'no-var': 'error',
      'no-with': 'error',
      'default-case-last': 'error',
      'unicorn/error-message': 'error',
      'unicorn/prefer-number-properties': 'error',
      'vite-plus/prefer-vite-plus-imports': 'error',
    },
    ignorePatterns: ['**/*.gen.ts', '**/*.d.ts', 'public/**'],
    overrides: [
      {
        files: ['src/components/ui/**'],
        rules: {
          'import/no-namespace': 'off',
          'typescript/consistent-type-definitions': 'off',
        },
      },
    ],
    jsPlugins: [
      {
        name: 'vite-plus',
        specifier: 'vite-plus/oxlint-plugin',
      },
    ],
  },
  optimizeDeps: { entries: POST_COMPONENT_ENTRIES },
  environments: {
    ssr: { optimizeDeps: { entries: POST_COMPONENT_ENTRIES } },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    tsconfigPaths: true,
  },
  plugins: lazyPlugins(() => [
    // The Workers runtime can't host Vitest's runner; tests run in plain Node.
    ...(process.env.VITEST
      ? []
      : [cloudflare({ viteEnvironment: { name: 'ssr' } })]),
    devtools({ removeDevtoolsOnBuild: true }),
    tailwindcss(),
    mdx({
      remarkPlugins: [remarkFrontmatter, remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypePrettyCode,
          {
            theme: {
              dark: 'github-dark',
              light: 'github-light',
            },
            defaultLang: 'text',
          },
        ],
        rehypeExportToc,
      ],
    }),
    tanstackStart({
      prerender: {
        enabled: true,
        crawlLinks: true,
        failOnError: true,
      },
    }),
    contentCollections(),
    postPreloads(),
    ogImages(),
    viteReact(),
    babel({ presets: [reactCompilerPreset()] }),
  ]),
});

export default config;
