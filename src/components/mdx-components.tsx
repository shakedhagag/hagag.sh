import { Link } from "@tanstack/react-router";
import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import * as React from "react";

type MDXComponents = Record<string, React.ComponentType<any>>;

function BlogLink({ href = "", ...props }: React.ComponentProps<"a">) {
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
}: React.ComponentProps<"h2"> & {
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
}: React.ComponentProps<"pre">) {
  const [copied, setCopied] = React.useState(false);
  const preRef = React.useRef<HTMLPreElement>(null);

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
        {copied ? <CheckIcon weight="bold" /> : <CopyIcon />}
        <span>{copied ? "Copied" : "Copy"}</span>
      </button>
      <pre ref={preRef} className={className} {...props}>
        {children}
      </pre>
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
