import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';
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

  const codeProps = convertAttribs(codeElement.attribs);

  const codeElementJSX = (
    <code {...codeProps}>
      {domToReact(codeElement.children as Array<DOMNode>, options)}
    </code>
  );

  const codeBlockProps: Record<string, any> = {
    'data-language': language,
  };

  if (title) {
    codeBlockProps.title = title;
  }

  if (preElement.attribs.class) {
    codeBlockProps.className = preElement.attribs.class;
  }

  return (
    <CodeBlock {...codeBlockProps}>
      <Pre>{codeElementJSX}</Pre>
    </CodeBlock>
  );
}

