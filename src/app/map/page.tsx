import Link from "next/link";
import HawaiiMap from "@/components/map/hawaiimap";
import Image from 'next/image';

export default function MapPage() {
  return (
    <main>
      <div className="p-8">
        <Link href="/">← Home</Link>
      </div>
      {/* Logo in the top-right corner */}
      <Image
        src="/img/TransparentPlaceholderLogo.png"
        alt="Placeholders Logo"
        width={1120}
        height={485}
        className="pointer-events-none fixed right-6 top-2 z-50 h-auto w-[150px] brightness-0 invert"
      />
      <HawaiiMap />
    </main>
  );
}
