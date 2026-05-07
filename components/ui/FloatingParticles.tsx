"use client";

import { useMemo } from "react";

interface Props {
  count?: number;
}

export default function FloatingParticles({ count = 30 }: Props) {
  const particles = useMemo(() => {
    // Deterministic — no SSR mismatch
    const seed = (i: number, n: number) =>
      Math.abs(Math.sin((i + 1) * (n + 1) * 7919)) % 1;

    return Array.from({ length: count }, (_, i) => ({
      left: seed(i, 1) * 100,
      top: seed(i, 2) * 100,
      size: 2 + seed(i, 3) * 3,
      duration: 10 + seed(i, 4) * 10,
      delay: seed(i, 5) * 5,
    }));
  }, [count]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-primary/40"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            boxShadow: `0 0 ${p.size * 3}px hsl(var(--primary) / 0.5)`,
            animation: `floatParticle ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes floatParticle {
          0%, 100% { transform: translate(0, 0); opacity: 0.4; }
          25% { transform: translate(30px, -40px); opacity: 0.8; }
          50% { transform: translate(-20px, -80px); opacity: 0.6; }
          75% { transform: translate(-40px, -30px); opacity: 0.7; }
        }
        @media (prefers-reduced-motion: reduce) {
          span { animation: none !important; }
        }
      `}</style>
    </div>
  );
}