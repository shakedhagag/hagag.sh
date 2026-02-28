import { Link } from '@tanstack/react-router';

export function Header() {
  return (
    <header className="mb-14 flex flex-row place-content-between">
      <Link
        to="/"
        className="inline-block font-black font-montserrat text-2xl hover:scale-[1.02]"
        viewTransition
      >
        <span
          style={{
            backgroundImage:
              'linear-gradient(45deg, var(--green), var(--purple))',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          hagag.sh
        </span>
        <br />
      </Link>
      <span className="relative top-1 italic">
        by
        <a
          href="https://github.com/shaked-frame"
          className="inline-block scale-100 active:scale-100"
        >
          <img
            src="https://avatars.githubusercontent.com/u/76105109?v=4"
            alt="shagag"
            className="relative -top-1 mx-2 inline h-8 w-8 rounded-full"
            width="32"
            height="32"
          />
        </a>
      </span>
    </header>
  );
}
