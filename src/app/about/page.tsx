import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
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
