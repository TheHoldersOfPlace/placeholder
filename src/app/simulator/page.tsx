import Link from "next/link";
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import SimulationMain from "../../components/SimulationMain";
import SimulationUI from "../../components/SimulationUI";
import Image from 'next/image';

export default function SimulatorPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
            <SimulationMain /> 
            <section className="absolute inset-0 z-10 p-8 text-white">
                <Link href="/">← Home</Link>
                <h1>Sound Speed Simulation</h1>
                <SimulationUI /> 
            </section>
            <Image
              src="/img/TransparentPlaceholderLogo.png"
              alt="Placeholders Logo"
              width={1120}
              height={485}
              className="pointer-events-none fixed right-6 top-4 z-50 h-auto w-[180px] brightness-0 invert"
              />
        </main>
  );
}
