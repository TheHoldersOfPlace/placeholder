import Link from "next/link";
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import SimulationMain from "../../components/SimulationMain";
import SimulationUI from "../../components/SimulationUI";

export default function SimulatorPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
            <SimulationMain /> 
            <section className="absolute inset-0 z-10 p-8 text-white">
                <h1 className="mb-3">Sound Speed Simulation</h1>
                <SimulationUI />
                <Link href="/" className="rounded border bg-black px-4 py-2 text-white hover:bg-gray-800">
                  Home
                </Link> 
            </section>
        </main>
  );
}
