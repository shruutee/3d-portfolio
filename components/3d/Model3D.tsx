"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  OrbitControls,
  useAnimations,
  Float,
  PerformanceMonitor,
} from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

interface ModelProps {
  path: string;
  scale?: number;
  followCursor?: boolean;
  autoRotate?: boolean;
  floatEnabled?: boolean;
  animationSpeed?: number;
  rotationSpeed?: number;
  floatSpeed?: number;
  active?: boolean;
}

function Model({
  path,
  scale = 1,
  followCursor = false,
  autoRotate = false,
  floatEnabled = false,
  animationSpeed = 0.5,
  rotationSpeed = 0.18,
  floatSpeed = 0.75,
  active = true,
}: ModelProps) {
  const { scene, animations } = useGLTF(path);
  const { actions } = useAnimations(animations, scene);
  const ref = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    scene.position.sub(center);
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.frustumCulled = true;
        child.castShadow = false;
        child.receiveShadow = false;
      }
    });
  }, [scene]);

  useEffect(() => {
    const first = Object.values(actions)[0];
    if (first) {
      first.timeScale = animationSpeed;
      first.paused = !active;
      first.reset().fadeIn(0.5).play();
    }
    return () => {
      first?.fadeOut(0.5);
    };
  }, [actions, animationSpeed, active]);

  useEffect(() => {
    if (!followCursor) return;
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [followCursor]);

  useFrame((_, delta) => {
    if (!active) return;
    if (!ref.current) return;
    if (followCursor) {
      const ty = mouse.current.x * 0.6;
      const tx = -mouse.current.y * 0.3;
      ref.current.rotation.y += (ty - ref.current.rotation.y) * 0.08;
      ref.current.rotation.x += (tx - ref.current.rotation.x) * 0.08;
    } else if (autoRotate) {
      ref.current.rotation.y += delta * rotationSpeed;
    }
  });

  const content = <primitive ref={ref} object={scene} scale={scale} />;
  return floatEnabled ? (
    <Float speed={floatSpeed} rotationIntensity={0.12} floatIntensity={0.35}>
      {content}
    </Float>
  ) : (
    content
  );
}

interface Model3DProps {
  path: string;
  scale?: number;
  height?: number;
  followCursor?: boolean;
  autoRotate?: boolean;
  enableControls?: boolean;
  cameraPosition?: [number, number, number];
  floatEnabled?: boolean;
  animationSpeed?: number;
  rotationSpeed?: number;
  floatSpeed?: number;
  pauseWhenOffscreen?: boolean;
}

export default function Model3D({
  path,
  scale = 1,
  height = 400,
  followCursor = false,
  autoRotate = true,
  enableControls = false,
  cameraPosition = [0, 0, 5],
  floatEnabled = false,
  animationSpeed = 0.5,
  rotationSpeed = 0.18,
  floatSpeed = 0.75,
  pauseWhenOffscreen = false,
}: Model3DProps) {
  const [dpr, setDpr] = useState<[number, number]>([1, 1.35]);
  const [active, setActive] = useState(!pauseWhenOffscreen);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pauseWhenOffscreen) return;
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "180px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [pauseWhenOffscreen]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full"
      style={{ height }}
      role="img"
      aria-label="Interactive 3D model"
    >
      <Canvas
        camera={{ position: cameraPosition, fov: 45 }}
        dpr={dpr}
        frameloop={active ? "always" : "demand"}
        gl={{
          alpha: true,
          antialias: false,
          depth: true,
          powerPreference: "high-performance",
          stencil: false,
        }}
        style={{ background: "transparent" }}
      >
        <PerformanceMonitor
          flipflops={2}
          onDecline={() => setDpr([0.85, 1])}
          onIncline={() => setDpr([1, 1.35])}
        />
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 5, 5]} intensity={1.4} />
        <directionalLight position={[-5, -5, -5]} intensity={0.4} />
        <pointLight position={[0, 5, 0]} intensity={0.8} color="#a78bfa" />
        <pointLight position={[5, -5, 5]} intensity={0.6} color="#ec4899" />

        <Suspense fallback={null}>
          <Model
            path={path}
            scale={scale}
            followCursor={followCursor}
            autoRotate={!followCursor && autoRotate}
            floatEnabled={floatEnabled}
            animationSpeed={animationSpeed}
            rotationSpeed={rotationSpeed}
            floatSpeed={floatSpeed}
            active={active}
          />
        </Suspense>

        {enableControls && (
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate
            autoRotate
            autoRotateSpeed={1}
            makeDefault
          />
        )}
      </Canvas>
    </div>
  );
}

// Preload (call in pages that use it for instant load)
useGLTF.preload(`${BASE_PATH}/models/robot.glb`);
