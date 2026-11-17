import Link from "next/link";
import HawaiiMap from "@/components/map/hawaiimap";

export default function MapPage() {
  return (
    <main>
      <div className="p-8">
        <Link href="/">← Home</Link>
      </div>
      <HawaiiMap />
    </main>
  );
}
