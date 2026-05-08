import { ScrollArea } from "@base-ui/react/scroll-area";
import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import {
  type ComponentProps,
  type ComponentType,
  useRef,
  useState,
} from "react";

type MDXComponents = Record<string, ComponentType<any>>;

function BlogLink({ href = "", ...props }: ComponentProps<"a">) {
  if (href.startsWith("/")) {
    return <Link to={href} {...props} />;
  }

  return <a href={href} {...props} />;
}

function BlogHeading({
  as: Component,
  children,
  id,
  ...props
}: ComponentProps<"h2"> & {
  as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}) {
  return (
    <Component id={id} {...props}>
      {id ? (
        <>
          <a
            aria-label={`Link to ${id}`}
            className="heading-anchor"
            href={`#${id}`}
          >
            #
          </a>
          <a className="heading-link" href={`#${id}`}>
            {children}
          </a>
        </>
      ) : (
        children
      )}
    </Component>
  );
}

function BlogCodeBlock({
  children,
  className = "",
  ...props
}: ComponentProps<"pre">) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  async function copyCode() {
    const code = preRef.current?.textContent;
    if (!code) return;

    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <figure className="not-prose code-block">
      <button className="code-block-copy" type="button" onClick={copyCode}>
        {copied ? (
          <CheckIcon weight="bold" />
        ) : (
          <CopyIcon className="size-4" weight="bold" />
        )}
        <span>{copied ? "Copied" : "Copy"}</span>
      </button>
      <ScrollArea.Root className="code-block-scroll">
        <ScrollArea.Viewport className="code-block-viewport">
          <pre ref={preRef} className={className} {...props}>
            {children}
          </pre>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          className="code-block-scrollbar"
          orientation="horizontal"
        >
          <ScrollArea.Thumb className="code-block-thumb" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </figure>
  );
}

export const mdxComponents: MDXComponents = {
  a: BlogLink,
  h1: (props) => <BlogHeading as="h1" {...props} />,
  h2: (props) => <BlogHeading as="h2" {...props} />,
  h3: (props) => <BlogHeading as="h3" {...props} />,
  h4: (props) => <BlogHeading as="h4" {...props} />,
  h5: (props) => <BlogHeading as="h5" {...props} />,
  h6: (props) => <BlogHeading as="h6" {...props} />,
  pre: BlogCodeBlock,
};
