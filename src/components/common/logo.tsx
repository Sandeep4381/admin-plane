import Image from 'next/image';
import Link from 'next/link';

export function Logo() {
  return (
    <Link
      href="/dashboard"
      className="flex items-center gap-2 p-2 font-semibold text-foreground"
    >
      <Image
        src="/logo.svg"
        alt="SawariKaro Logo"
        width={140}
        height={40}
        className="dark:invert"
      />
    </Link>
  );
}
