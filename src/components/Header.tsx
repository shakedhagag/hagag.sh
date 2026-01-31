import { Link } from '@tanstack/react-router';

export function Header() {
  return (
    <header className="mb-14 flex flex-row place-content-between">
      <Link
        to="/"
        className="inline-block font-black text-2xl hover:scale-[1.02]"
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
          shagag
        </span>
        <br />
        <span className="font-medium text-muted-foreground text-xs leading-none">
          Frontend Engineer
        </span>
      </Link>
      <span className="relative top-[4px] italic">
        by
        <a
          href="https://github.com/shakedhagag"
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
