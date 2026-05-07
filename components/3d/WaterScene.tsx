"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  Float,
  useAnimations,
  PerformanceMonitor,
} from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";

function Water({ active }: { active: boolean }) {
  const { scene, animations } = useGLTF("/models/water.glb");
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    scene.position.sub(center);
  }, [scene]);

  useEffect(() => {
    const first = Object.values(actions)[0];
    if (first) {
      first.timeScale = 0.45;
      first.paused = !active;
      first.reset().fadeIn(0.8).play();
    }
    return () => {
      first?.fadeOut(0.5);
    };
  }, [actions, active]);

  return <primitive object={scene} scale={3.1} position={[0, -1.5, 0]} />;
}

function FloatingRobot({ active }: { active: boolean }) {
  const { scene, animations } = useGLTF("/models/robot.glb");
  const { actions } = useAnimations(animations, scene);
  const ref = useRef<THREE.Group>(null);

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    scene.position.sub(center);
  }, [scene]);

  useEffect(() => {
    const first = Object.values(actions)[0];
    if (first) {
      first.timeScale = 0.35;
      first.paused = !active;
      first.reset().fadeIn(0.5).play();
    }
    return () => {
      first?.fadeOut(0.5);
    };
  }, [actions, active]);

  useFrame((_, delta) => {
    if (!active) return;
    if (ref.current) ref.current.rotation.y += delta * 0.12;
  });

  return (
    <Float speed={0.7} rotationIntensity={0.08} floatIntensity={0.35}>
      <group ref={ref} position={[0, 0.5, 0]}>
        <primitive object={scene} scale={1.6} />
      </group>
    </Float>
  );
}

interface Props {
  height?: number;
  active?: boolean;
}

export default function WaterScene({ height = 600, active = true }: Props) {
  const [dpr, setDpr] = useState<[number, number]>([1, 1]);

  return (
    <div
      className="w-full"
      style={{ height }}
      role="img"
      aria-label="3D water scene with floating robot"
    >
      <Canvas
        camera={{ position: [0, 1, 6], fov: 45 }}
        dpr={dpr}
        frameloop={active ? "always" : "demand"}
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <PerformanceMonitor
          onDecline={() => setDpr([1, 1])}
          onIncline={() => setDpr([1, 1])}
        />
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 10, 5]} intensity={1.4} color="#a78bfa" />
        <directionalLight position={[-5, 5, -5]} intensity={0.7} color="#ec4899" />
        <pointLight position={[0, 3, 3]} intensity={1.2} color="#6c47ff" />

        <Suspense fallback={null}>
          <Water active={active} />
          <FloatingRobot active={active} />
        </Suspense>

        <fog attach="fog" args={["#0a0a1a", 5, 15]} />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/water.glb");
useGLTF.preload("/models/robot.glb");
