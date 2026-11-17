'use client' // adding reactivity

import { useState, useEffect } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";

// data inputs; will change later to pipe in from map
let theta = 0.; // launch angle
let z_s = 10; // source depth
let g_t = -2.; // thermocline gradient
let d = 500; // total ocean depth (m)


// ui labels and buttons
export default function SimulationUI() {
    const y_height = 300;
    const x_length = 500;

    // updatable variables
    const [time, setTime] = useState(0); // so we can update per-frame
    const [theta, setTheta] = useState(10); // launch angle (degrees)
    const [source, setSource] = useState(1500); // source depth
    const [thermocline, setThermocline] = useState(-2);
    //const [depth, setDepth] = useState(2500);
    const depth = 2500; // fixed depth

    // ui vars
    const x_pad = 50;
    const y_max = y_height - 5;
    const y_min = 10; // i dont know
    const label_num = 6; // 6 total labels from 0-2500m
    let spacing = (i: number) => {return y_min + i * (y_max-y_min)/(label_num-1)}; // inputs 0-5
    // ^ basically represents ui-space 500m

    // all the math calculation stuff here (i.e. calculating inputs to the ray)
    let angleRad = (theta * Math.PI) / 180; // convert to radians
    let dx = Math.cos(angleRad);
    let dy = Math.sin(angleRad);
    let convertDepth = (m: number) => y_min + (m / depth) * (y_max - y_min);
    let source_coords = {x: x_pad, y: convertDepth(source)}; // coords in ui space
    const surfaceY = convertDepth(0); // water surface


    let speed = 1500.; // temp
    const rayLength = 360; // display length only

    // ok wait i need a ray for:
        // launch angle (NOT the final sound speed ray)
        // final sound speed
        // reflected ray (if any)

    // steps:
        // use mckenzie's law to calculate sound speed via temp, depth, salinity
        // use sound speed for snells law
        // use THAT 

    // reflection
    const outgoingLength = 180;
        const hitDistance =
        Math.abs(dy) < 1e-6
            ? -1
            : (surfaceY - source_coords.y) / dy;

    const hitsTop = dy < 0 && hitDistance > 0;

    const endpoint = hitsTop
    ? { x: source_coords.x + hitDistance * dx, y: surfaceY }
    : {
        x: source_coords.x + rayLength * dx,
        y: source_coords.y + rayLength * dy,
        };

    const reflectedEnd = {
    x: endpoint.x + outgoingLength * dx,
    y: endpoint.y - outgoingLength * dy,
    };

    // enabling animation with requestAnimationFrame
    useEffect(() => {
        const start = performance.now();
        let frame: number;

        const animate = (now: number) => {
            setTime((now - start) / 1000); // converts from ms
            frame = requestAnimationFrame(animate);
        };

        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame); // cancels upon unmounting
    }, []);


    // ui / visual formatting here
    
    return (
        <div id="sim-main" className="absolute left-8 top-1/2 z-10 -translate-y-1/2">
            <Row>
                <Col>
                    {/* other graph on the left? */}
                    <text fill="white">testing</text>
                </Col>
                <Col className="w-170 translate-x-1/3">
                
                    {/* main simulation ui */}
                    <svg
                        viewBox="0 0 500 300"
                        role="img"
                        >
                        {/* y axis*/}
                        <line x1={x_pad} y1="0" x2={x_pad} y2={y_height} stroke="white" strokeWidth="2"/>
                        
                        {/* ray */}
                        <line
                            x1={source_coords.x} y1={source_coords.y} x2={endpoint.x} y2={endpoint.y}
                            stroke="red" strokeWidth="2"
                        />
                        {hitsTop && (
                            <line
                            x1={endpoint.x} y1={endpoint.y} x2={reflectedEnd.x} y2={reflectedEnd.y}
                            stroke="red" strokeWidth="2"
                        />
                        )}
                        
                        {/* axis labels */}
                        <text x="14" y={spacing(0)} fill="white" fontFamily="Courier" fontSize="10">0m</text>
                        <text x="14" y={spacing(1)} fill="white" fontFamily="Courier" fontSize="10">500m</text>
                        <text x="14" y={spacing(2)} fill="white" fontFamily="Courier" fontSize="10">1000m</text>
                        <text x="14" y={spacing(3)} fill="white" fontFamily="Courier" fontSize="10">1500m</text>
                        <text x="14" y={spacing(4)} fill="white" fontFamily="Courier" fontSize="10">2000m</text>
                        <text x="14" y={spacing(5)} fill="white" fontFamily="Courier" fontSize="10">2500m</text>
                    </svg>
                </Col>
            </Row>
            <Row className="absolute">
                {/* Sliders for inputs */}
                <Form >
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="angle">Launch angle: {theta}°</Form.Label>
                        <Form.Range
                        id="angle"
                        min={-45}
                        max={45}
                        step={1}
                        value={theta}
                        onChange={(event) => setTheta(Number(event.target.value))}
                        />
                    </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label htmlFor="source">Source depth: {source} m</Form.Label>
                        <Form.Range
                        id="source"
                        min={0}
                        max={depth}
                        step={10}
                        value={source}
                        onChange={(event) => setSource(Number(event.target.value))}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="thermocline">
                        Thermocline gradient: {thermocline}
                        </Form.Label>
                        <Form.Range
                        id="thermocline"
                        min={-10}
                        max={0}
                        step={0.1}
                        value={thermocline}
                        onChange={(event) => setThermocline(Number(event.target.value))}
                        />
                    </Form.Group>
                </Form>
            </Row>


        </div>
        
    );

}