// src/components/Markdown.tsx

import { Link } from '@tanstack/react-router';
import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';
import parse, {
  type DOMNode,
  domToReact,
  Element,
  type HTMLReactParserOptions,
} from 'html-react-parser';
import { useEffect, useState } from 'react';
import { type MarkdownResult, renderMarkdown } from '@/utils/markdown';

type MarkdownProps = {
  content: string;
  className?: string;
};

const LANGUAGE_REGEX = /language-(\w+)/;

// Convert HTML style string to React style object
function parseStyle(styleString: string): React.CSSProperties {
  const style: Record<string, string> = {};
  if (!styleString) return style as React.CSSProperties;

  styleString.split(';').forEach(rule => {
    const [property, value] = rule.split(':').map(s => s.trim());
    if (property && value) {
      // Convert kebab-case to camelCase
      const camelProperty = property.replace(/-([a-z])/g, (_, letter) =>
        letter.toUpperCase()
      );
      style[camelProperty] = value;
    }
  });

  return style as React.CSSProperties;
}

// Convert HTML attributes to React props
function convertAttribs(attribs: Record<string, string>) {
  const props: Record<string, any> = { ...attribs };

  // Convert style string to object
  if (props.style && typeof props.style === 'string') {
    props.style = parseStyle(props.style);
  }

  // Convert class to className
  if (props.class) {
    props.className = props.class;
    delete props.class;
  }

  return props;
}

export function Markdown({ content, className }: MarkdownProps) {
  const [result, setResult] = useState<MarkdownResult | null>(null);

  useEffect(() => {
    renderMarkdown(content).then(setResult);
  }, [content]);

  if (!result) {
    return <div className={className}>Loading...</div>;
  }

  const options: HTMLReactParserOptions = {
    replace: domNode => {
      if (domNode instanceof Element) {
        // Handle code blocks with Fumadocs CodeBlock
        if (domNode.name === 'pre') {
          const codeElement = domNode.children.find(
            (child): child is Element =>
              child instanceof Element && child.name === 'code'
          );

          if (codeElement) {
            // Extract language from code element's class (e.g., "language-js" -> "js")
            const languageClass = codeElement.attribs.class || '';
            const languageMatch = languageClass.match(LANGUAGE_REGEX);
            const language = languageMatch ? languageMatch[1] : '';

            // Extract title - check multiple possible locations
            // rehype-pretty-code sets data-title on the <pre> element
            const title =
              domNode.attribs['data-title'] ||
              domNode.attribs.title ||
              codeElement.attribs['data-title'] ||
              codeElement.attribs.title ||
              '';

            // Convert attributes to React props
            const codeProps = convertAttribs(codeElement.attribs);

            // Preserve the entire code element structure with all its attributes and highlighted spans
            const codeElementJSX = (
              <code {...codeProps}>
                {domToReact(codeElement.children as Array<DOMNode>, options)}
              </code>
            );

            // CodeBlock expects data-title as a prop (not data-title attribute)
            // Pass title only if it exists
            const codeBlockProps: Record<string, any> = {
              'data-language': language,
            };

            if (title) {
              codeBlockProps['data-title'] = title;
            }

            // Preserve pre element's class
            if (domNode.attribs.class) {
              codeBlockProps.className = domNode.attribs.class;
            }

            return (
              <CodeBlock {...codeBlockProps}>
                <Pre>{codeElementJSX}</Pre>
              </CodeBlock>
            );
          }
        }

        // Customize rendering of specific elements
        if (domNode.name === 'a') {
          // Handle links
          const href = domNode.attribs.href;
          if (href?.startsWith('/')) {
            // Internal link - use your router's Link component
            return (
              <Link to={href}>
                {domToReact(domNode.children as Array<DOMNode>, options)}
              </Link>
            );
          }
        }

        if (domNode.name === 'img') {
          // Add lazy loading to images
          const imgProps = convertAttribs(domNode.attribs);
          return (
            <img
              {...imgProps}
              loading="lazy"
              className={`rounded-lg shadow-md ${imgProps.className || ''}`}
            />
          );
        }
      }
    },
  };

  return <div className={className}>{parse(result.markup, options)}</div>;
}
