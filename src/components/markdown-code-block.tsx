import {
  type DOMNode,
  domToReact,
  Element,
  type HTMLReactParserOptions,
} from 'html-react-parser';

type MarkdownCodeBlockProps = {
  preElement: Element;
  options: HTMLReactParserOptions;
};

const LANGUAGE_REGEX = /language-(\w+)/;

function parseStyle(styleString: string): React.CSSProperties {
  const style: Record<string, string> = {};
  if (!styleString) return style as React.CSSProperties;

  styleString.split(';').forEach(rule => {
    const [property, value] = rule.split(':').map(segment => segment.trim());
    if (property && value) {
      const camelProperty = property.replace(/-([a-z])/g, (_, letter) =>
        letter.toUpperCase()
      );
      style[camelProperty] = value;
    }
  });

  return style as React.CSSProperties;
}

function convertAttribs(attribs: Record<string, string>) {
  const props: Record<string, any> = { ...attribs };

  if (props.style && typeof props.style === 'string') {
    props.style = parseStyle(props.style);
  }

  if (props.class) {
    props.className = props.class;
    delete props.class;
  }

  return props;
}

export function MarkdownCodeBlock({
  preElement,
  options,
}: MarkdownCodeBlockProps) {
  const codeElement = preElement.children.find(
    (child): child is Element => child instanceof Element && child.name === 'code'
  );

  if (!codeElement) return null;

  const languageClass = codeElement.attribs.class || '';
  const languageMatch = languageClass.match(LANGUAGE_REGEX);
  const language = languageMatch ? languageMatch[1] : '';

  const title =
    preElement.attribs['data-title'] ||
    preElement.attribs.title ||
    codeElement.attribs['data-title'] ||
    codeElement.attribs.title ||
    '';

  const preProps = convertAttribs(preElement.attribs);
  const codeProps = convertAttribs(codeElement.attribs);

  const codeElementJSX = (
    <code {...codeProps}>
      {domToReact(codeElement.children as Array<DOMNode>, options)}
    </code>
  );

  return (
    <figure className="not-prose my-5 overflow-hidden rounded-xl border bg-card shadow-sm" data-language={language}>
      {(title || language) && (
        <figcaption className="border-b px-4 py-2 font-medium text-muted-foreground text-xs">
          {title || language}
        </figcaption>
      )}
      <pre
        {...preProps}
        className={`m-0 overflow-x-auto p-4 text-sm ${preProps.className || ''}`}
      >
        {codeElementJSX}
      </pre>
    </figure>
  );
}

