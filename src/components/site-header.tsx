import { Link } from '@tanstack/react-router';

export function Header() {
  return (
    <header className="mbe-14 flex justify-between">
      <Link
        to="/"
        className="inline-block font-sans text-2xl font-black hover:scale-[1.02] active:scale-[0.97] motion-safe:transition-transform motion-safe:duration-150 motion-safe:ease-out"
        viewTransition
      >
        <span className="bg-linear-45/srgb from-accent-foreground to-accent bg-clip-text text-transparent">
          hagag.sh
        </span>
      </Link>
      <span className="relative inset-bs-1 italic">
        by
        <a
          href="https://github.com/shaked-frame"
          className="relative inline-block after:absolute after:inset-[min(0px,(100%-44px)/2)] active:scale-[0.97] motion-safe:transition-transform motion-safe:duration-150 motion-safe:ease-out"
        >
          <img
            src="https://avatars.githubusercontent.com/u/76105109?v=4"
            alt="shagag"
            className="relative -inset-bs-1 mx-2 inline size-8 rounded-full object-cover"
            width="32"
            height="32"
          />
        </a>
      </span>
    </header>
  );
}
