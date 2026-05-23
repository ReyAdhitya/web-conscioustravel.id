"use client";

import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { Float, Environment } from "@react-three/drei";
import * as THREE from "three";
import { useMemo, useRef } from "react";

/**
 * A soft, slow, painterly 3D scene for the hero:
 *  - cream/forest shader background driven by curl-noise (custom GLSL)
 *  - drifting glow particles
 *  - one gently floating organic shape
 *  - bloom + vignette for cinematic depth
 */
export function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.8]}
      gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
      camera={{ position: [0, 0, 4.5], fov: 45 }}
      className="pointer-events-none"
    >
      <ShaderBackground />
      <ambientLight intensity={0.4} />
      <directionalLight position={[2, 3, 2]} intensity={0.9} color="#faf7f1" />
      <Float speed={0.8} rotationIntensity={0.4} floatIntensity={0.9}>
        <Orb />
      </Float>
      <Particles count={140} />
      <Environment preset="dawn" environmentIntensity={0.4} />
      <EffectComposer multisampling={4}>
        <Bloom intensity={0.45} luminanceThreshold={0.6} luminanceSmoothing={0.5} />
        <Vignette eskil={false} offset={0.25} darkness={0.4} />
      </EffectComposer>
    </Canvas>
  );
}

function Orb() {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (!mesh.current) return;
    mesh.current.rotation.y += dt * 0.12;
    mesh.current.rotation.x += dt * 0.05;
  });
  return (
    <mesh ref={mesh} position={[1.6, 0.2, 0]}>
      <icosahedronGeometry args={[0.75, 4]} />
      <meshPhysicalMaterial
        color="#2d5240"
        roughness={0.28}
        metalness={0.05}
        clearcoat={0.8}
        clearcoatRoughness={0.2}
        transmission={0.25}
        thickness={1.4}
        attenuationColor="#162a22"
        attenuationDistance={2}
      />
    </mesh>
  );
}

function Particles({ count }: { count: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 4.5;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return arr;
  }, [count]);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const positions = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      positions.array[ix + 1] += Math.sin(t + i) * 0.0008;
      positions.array[ix] += Math.cos(t * 0.4 + i) * 0.0006;
    }
    positions.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#2d5240"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;

  // Iquilez gradient noise (cheap, painterly)
  vec3 hash3(vec2 p) {
    vec3 q = vec3(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)), dot(p, vec2(419.2, 371.9)));
    return fract(sin(q) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(dot(hash3(i + vec2(0.0,0.0)).xy - 0.5, f - vec2(0.0,0.0)),
          dot(hash3(i + vec2(1.0,0.0)).xy - 0.5, f - vec2(1.0,0.0)), u.x),
      mix(dot(hash3(i + vec2(0.0,1.0)).xy - 0.5, f - vec2(0.0,1.0)),
          dot(hash3(i + vec2(1.0,1.0)).xy - 0.5, f - vec2(1.0,1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float a = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 5; i++) {
      a += amp * noise(p);
      p *= 2.0;
      amp *= 0.5;
    }
    return a;
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = uv * 2.5;
    p.x += uTime * 0.04;
    p.y -= uTime * 0.02;
    float n = fbm(p + fbm(p + uTime * 0.03));
    n = smoothstep(-0.4, 0.6, n);
    vec3 c = mix(uColorA, uColorB, n);
    c = mix(c, uColorC, smoothstep(0.55, 0.95, n) * 0.6);
    // very gentle vignette inside the shader
    float d = distance(uv, vec2(0.5)) * 1.25;
    c = mix(c, uColorA * 0.92, smoothstep(0.6, 1.1, d));
    gl_FragColor = vec4(c, 1.0);
  }
`;

function ShaderBackground() {
  const { size } = useThree();
  const ref = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uColorA: { value: new THREE.Color("#faf7f1") },
      uColorB: { value: new THREE.Color("#e8dfcc") },
      uColorC: { value: new THREE.Color("#2d5240") },
    }),
    [size.width, size.height],
  );

  useFrame((_, dt) => {
    if (!ref.current) return;
    (ref.current.uniforms.uTime as { value: number }).value += dt;
  });

  return (
    <mesh position={[0, 0, -2]} scale={[20, 20, 1]} renderOrder={-1}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={ref}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}
