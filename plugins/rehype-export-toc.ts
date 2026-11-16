import type { Element, ElementContent, Root } from 'hast';
import type { TocItem } from '../src/lib/mdx';

function textOf(node: ElementContent): string {
  if (node.type === 'text') return node.value;
  if (node.type === 'element') return node.children.map(textOf).join('');
  return '';
}

function collectHeadings(nodes: Array<Root['children'][number]>) {
  const items: Array<TocItem> = [];

  for (const node of nodes) {
    if (node.type !== 'element') continue;
    const el = node as Element;
    const id = el.properties.id;

    if (el.tagName === 'h2' || el.tagName === 'h3') {
      if (typeof id !== 'string') {
        throw new TypeError(
          `rehypeExportToc: <${el.tagName}> has no id; run rehype-slug first`
        );
      }
      items.push({
        id,
        label: el.children.map(textOf).join('').trim(),
        level: el.tagName === 'h3' ? 3 : 2,
      });
      continue;
    }

    items.push(...collectHeadings(el.children));
  }

  return items;
}

export function rehypeExportToc() {
  return (tree: Root) => {
    const toc = collectHeadings(tree.children);

    tree.children.unshift({
      type: 'mdxjsEsm',
      value: '',
      data: {
        estree: {
          type: 'Program',
          sourceType: 'module',
          body: [
            {
              type: 'ExportNamedDeclaration',
              specifiers: [],
              attributes: [],
              source: null,
              declaration: {
                type: 'VariableDeclaration',
                kind: 'const',
                declarations: [
                  {
                    type: 'VariableDeclarator',
                    id: { type: 'Identifier', name: 'toc' },
                    init: {
                      type: 'CallExpression',
                      optional: false,
                      callee: {
                        type: 'MemberExpression',
                        computed: false,
                        optional: false,
                        object: { type: 'Identifier', name: 'JSON' },
                        property: { type: 'Identifier', name: 'parse' },
                      },
                      arguments: [
                        { type: 'Literal', value: JSON.stringify(toc) },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    } as unknown as Root['children'][number]);
  };
}
