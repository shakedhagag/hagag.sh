import { Link } from "@tanstack/react-router";
import parse, {
  type DOMNode,
  domToReact,
  Element,
  type HTMLReactParserOptions,
} from "html-react-parser";
import { MarkdownCodeBlock } from "@/components/markdown-code-block";

type MarkdownProps = {
  markup: string;
  className?: string;
};

function parseStyle(styleString: string): React.CSSProperties {
  const style: Record<string, string> = {};
  if (!styleString) return style as React.CSSProperties;

  styleString.split(";").forEach((rule) => {
    const [property, value] = rule.split(":").map((s) => s.trim());
    if (property && value) {
      const camelProperty = property.replace(/-([a-z])/g, (_, letter) =>
        letter.toUpperCase(),
      );
      style[camelProperty] = value;
    }
  });

  return style as React.CSSProperties;
}

function convertAttribs(attribs: Record<string, string>) {
  const props: Record<string, any> = { ...attribs };

  if (props.style && typeof props.style === "string") {
    props.style = parseStyle(props.style);
  }

  if (props.class) {
    props.className = props.class;
    delete props.class;
  }

  return props;
}

export function aarkdown({ markup, className }: MarkdownProps) {
  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element) {
        if (domNode.name === "pre") {
          return <MarkdownCodeBlock preElement={domNode} options={options} />;
        }

        if (domNode.name === "a") {
          const href = domNode.attribs.href;
          if (href?.startsWith("/")) {
            return (
              <Link to={href}>
                {domToReact(domNode.children as Array<DOMNode>, options)}
              </Link>
            );
          }
        }

        if (domNode.name === "img") {
          const imgProps = convertAttribs(domNode.attribs);
          return (
            <img
              {...imgProps}
              decoding="async"
              className={`rounded-lg shadow-md ${imgProps.className || ""}`}
            />
          );
        }
      }
    },
  };

  return <div className={className}>{parse(markup, options)}</div>;
}
