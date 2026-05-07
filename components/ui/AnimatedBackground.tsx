"use client";

export default function AnimatedBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      />

      <style jsx>{`
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.35;
        }
        .blob-1 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%);
          top: -120px;
          left: -120px;
          animation: blob1 22s ease-in-out infinite;
        }
        .blob-2 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, hsl(320 90% 60%) 0%, transparent 70%);
          bottom: -100px;
          right: -100px;
          animation: blob2 26s ease-in-out infinite;
        }
        .blob-3 {
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, hsl(160 80% 45%) 0%, transparent 70%);
          top: 50%;
          left: 50%;
          animation: blob3 19s ease-in-out infinite;
        }
        @keyframes blob1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(100px, 80px) scale(1.15); }
          66% { transform: translate(-50px, 100px) scale(0.9); }
        }
        @keyframes blob2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-150px, -100px) scale(1.25); }
        }
        @keyframes blob3 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-30%, -70%) scale(1.3); }
        }
        @media (prefers-reduced-motion: reduce) {
          .blob { animation: none !important; }
        }
      `}</style>
    </div>
  );
}