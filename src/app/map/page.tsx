import Link from "next/link";
import HawaiiMap from "@/components/map/hawaiimap";

export default function MapPage() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 p-4 sm:p-8">
      <Link href="/">← Home</Link>
      <h1 className="text-3xl font-semibold">Hawaii Ocean Data Map</h1>
      <HawaiiMap />
    </main>
  );
}
