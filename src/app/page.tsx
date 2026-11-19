import Link from "next/link";
import Image from 'next/image';

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
      <Image
        src="/img/TransparentPlaceholderLogo.png"
        alt="Placeholders Logo"
        width={1120}
        height={485}
        className="mx-auto mb-6 h-auto w-[400px] brightness-0 dark:invert"
      />
      <h1 className="text-3xl font-bold">Home</h1>
      <nav className="flex gap-4">
        <Link href="/about" className="rounded border px-4 py-2 hover:bg-gray-100">
          About Us
        </Link>
        <Link href="/map" className="rounded border px-4 py-2 hover:bg-gray-100">
          Map
        </Link>
        <Link href="/simulator" className="rounded border px-4 py-2 hover:bg-gray-100">
          Simulator
        </Link>
      </nav>
    </main>
  );
}