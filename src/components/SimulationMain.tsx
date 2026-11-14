'use client'
import { useEffect, useRef } from "react";
import * as THREE from "three";

// 3d portions of the sim page + three.js rendering

export default function SimulationMain() {
    const mountRef = useRef<HTMLDivElement>(null); // ref to div element where scene will be mounted

    // scene
    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        const scene = new THREE.Scene();

        // scene/material data ----------------------------
        scene.background = new THREE.Color(0x000000); 

        // water plane
        const bgPlane = new THREE.PlaneGeometry(2,2); // bypassing camera matrices to normalize coords to -1, 1
        const bgMat = new THREE.ShaderMaterial({
            depthTest: false,
            depthWrite: false,
            uniforms: {
                u_time: { value: 0.0 },
                u_resolution: { value: new THREE.Vector2(1, 1) },
            },
            vertexShader: `
                varying vec2 vUv;

                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float u_time;
                uniform vec2 u_resolution;
                varying vec2 vUv;

                #define HASHSCALE 0.1031

                // utility functions
                float hash(float p) {
                    vec3 p3  = fract(vec3(p) * HASHSCALE);
                    p3 += dot(p3, p3.yzx + 19.19);
                    return fract((p3.x + p3.y) * p3.z);
                }

                float fade(float t) { return t*t*t*(t*(6.*t-15.)+10.); }

                float grad(float hash, float p) {
                    int i = int(1e4*hash);
                    return (i) == 0 ? p : -p;
                }

                float perlinNoise1D(float p) {
                    float pi = floor(p), pf = p - pi, w = fade(pf);
                    return mix(grad(hash(pi), pf), grad(hash(pi + 1.0), pf - 1.0), w) * 2.0;
                }

                float fbm(float pos, int octaves, float persistence) {
                    float total = 0., frequency = 1., amplitude = 1., maxValue = 0.;
                    for(int i = 0; i < octaves; ++i) 
                    {
                        total += perlinNoise1D(pos * frequency) * amplitude;
                        maxValue += amplitude;
                        amplitude *= persistence;
                        frequency *= 2.;
                    }
                    return total / maxValue;
                }

                // ref: https://www.shadertoy.com/view/lljGDt
                float rays(vec2 raySource, vec2 rayDir, vec2 coord, float seedA, float seedB, float speed) {
                    vec2 rayToCoord = coord - raySource;
                    float cosAngle = dot(normalize(rayToCoord), rayDir);
                    return clamp(
                        (0.45 + 0.15 * sin(cosAngle * seedA + u_time * speed)) +
                        (0.3 + 0.2 * cos(-cosAngle * seedB + u_time * speed)),
                        0.0, 1.0) *
                        clamp((u_resolution.x - length(rayToCoord)) / u_resolution.x, 0.5, 1.0
                    );
                }

                // ref: https://www.shadertoy.com/view/NsySWG 
                // restricts underwater surface to be below simulated "waves"
                vec4 waterSurface(vec2 uv, vec4 waterCol) {
                    float noise = .02 * (fbm(uv.x * 5. + u_time/6., 12, .01) + fbm(uv.x * 2. + u_time/4., 17, .1)); // wave height
                    float noise2 = .04 * (fbm(uv.x * 5. + (u_time + 35.)/6., 12, .01) + fbm(uv.x * 2. + (u_time + 34.)/4., 17, .1));
                    
                    float d = (uv.y + noise - 0.15) * 230.; // wave boundary 1
                    float d2 = (uv.y + 0.01 + noise2 - 0.15) * 230.; // wave boundary 2

                    // fill in area between curves; TODO: add specular
                    if (uv.y >= min(d,d2) && uv.y <= max(d,d2)) {
                        //waterCol = vec4(1.,1.,1.,0.3); // temp
                        if (uv.y >= d) { // "above"
                            waterCol = vec4(.7,.9,1.,1.);
                        } else if (uv.y >= d2) { // "below"
                            waterCol *= vec4(0.7,0.8,0.8,0.1);
                        }
                    }

                    float comb = max(d, d2); // combined height of both fns
                    float t = clamp(comb, 0., 1.); // mix degree
                    
                    vec4 skyColor = vec4(0.167, 0.296, 0.49, 1.0); // will change to lerp or something
                    skyColor = mix(vec4(0.051, 0.075, 0.302, 1.0), vec4(0.314, 0.529, 0.702,1.0), (uv.y + 0.5)/.5); // man idk
                    //waterCol *= skyColor + 0.3; // post processing on water
                    return vec4(mix(skyColor, waterCol, t));
                } 

                void main() {
                    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
                    uv.y = 1.0 - uv.y; // flip y for correct orientation
                    vec2 coord = vec2(gl_FragCoord.x, u_resolution.y - gl_FragCoord.y);

                    // rays
                    vec2 rayPos1 = vec2(u_resolution.x * 0.7, u_resolution.y * -0.4);
                    vec2 rayDir1 = normalize(vec2(1.0,-0.116));
                    float raySeedA1 = 36.1;
                    float raySeedB1 = 21.6;
                    float raySpeed1 = .8;

                    vec2 rayPos2 = vec2(u_resolution.x * 0.8, u_resolution.y * -0.3);
                    vec2 rayDir2 = normalize(vec2(1.0, 0.241));
                    const float raySeedA2 = 22.8;
                    const float raySeedB2 = 18.0;
                    const float raySpeed2 = .5;

                    // sun ray color per frag
                    vec4 rays1 = vec4(1.0, 1.0, 1.0, 1.0) *
                        rays(rayPos1, rayDir1, coord, raySeedA1, raySeedB1, raySpeed1);
                    vec4 rays2 = vec4(1.0,1.0,1.0,1.0) *
                        rays(rayPos2, rayDir2, coord, raySeedA2, raySeedB2, raySpeed2);


                    vec4 baseCol = vec4(0.047, 0.192, 0.259, 1.0);
                    vec4 rayCol = rays1 * 0.5 + rays2 * 0.4;

                    vec4 waterCol = baseCol + rayCol;

                    // brightness adjustments (gradient effect)
                    float brightness = 1.0 - (coord.y / u_resolution.y);
                    waterCol.r *= 0.1 + (brightness * 0.7);
                    waterCol.g *= 0.3 + (brightness * 0.6);
                    waterCol.b *= 0.6 + (brightness * 0.4);

                    // adds wave top
                    vec4 sceneCol = waterSurface(uv, waterCol);
                    //gl_FragColor = waterCol;
                    gl_FragColor = sceneCol;
                }
            `
        });
        
        const bgMesh = new THREE.Mesh(bgPlane, bgMat);
        bgMesh.renderOrder = -1;
        scene.add(bgMesh); // background water

        // cam
        const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
        cam.position.set(0, 0, 1);
        cam.lookAt(0,0,0);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mount.appendChild(renderer.domElement);

        // allows content to be resized when window is resized
        const resize = () => {
            const { width, height } = mount.getBoundingClientRect();
            if (width === 0 || height === 0) return;

            renderer.setSize(width, height);
            renderer.getDrawingBufferSize(bgMat.uniforms.u_resolution.value);
        };
        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(mount);
        resize();

        const timer = new THREE.Timer();
        timer.connect(document);

        // animation here
        renderer.setAnimationLoop(() => {
            timer.update();
            // do whatever
            
            bgMat.uniforms.u_time.value = timer.getElapsed();
            renderer.render(scene, cam);
        });

        // cleanup on unmount (removed from dom)
        return () => {
            resizeObserver.disconnect();
            renderer.setAnimationLoop(null);
            renderer.domElement.remove();
            
            renderer.dispose();
            bgPlane.dispose();
            bgMat.dispose();
        }
    }, [])

    return (
        <div ref={mountRef} className="absolute inset-0 z-0" />
    );
}
