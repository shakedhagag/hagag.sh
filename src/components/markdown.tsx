import { Link } from '@tanstack/react-router';
import parse, {
  type DOMNode,
  domToReact,
  Element,
  type HTMLReactParserOptions,
} from 'html-react-parser';
import { MarkdownCodeBlock } from '@/components/markdown-code-block';

type MarkdownProps = {
  markup: string;
  className?: string;
};

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

export function Markdown({ markup, className }: MarkdownProps) {
  const options: HTMLReactParserOptions = {
    replace: domNode => {
      if (domNode instanceof Element) {
        if (domNode.name === 'pre') {
          return <MarkdownCodeBlock preElement={domNode} options={options} />;
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
          const imgProps = convertAttribs(domNode.attribs);
          return (
            <img
              {...imgProps}
              decoding="async"
              className={`rounded-lg shadow-md ${imgProps.className || ''}`}
            />
          );
        }
      }
    },
  };

  return <div className={className}>{parse(markup, options)}</div>;
}
