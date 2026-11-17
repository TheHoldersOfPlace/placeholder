import { Card, Col, Container, Row } from 'react-bootstrap';
import SimulationMain from "../../components/SimulationMain";
import SimulationUI from "../../components/SimulationUI";

const SimulationPage = () => {
    // todo: pipe in specific stats from map page
    //const stats = await getstatsfrommappage(); // smth like that prob

    return (
        <main className="relative min-h-screen overflow-hidden">
            <SimulationMain /> 
            <section className="absolute inset-0 z-10 p-8 text-white">
                <h1>Sound Speed Simulation</h1>
                <SimulationUI />
            </section>
        </main>
    );
}


export default SimulationPage;