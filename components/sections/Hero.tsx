"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowDown, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { MagneticButton } from "@/components/ui/MagneticButton";

const Model3D = dynamic(() => import("@/components/3d/Model3D"), {
  ssr: false,
  loading: () => <RobotPlaceholder />,
});

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

interface Star {
  left: number;
  top: number;
  size: number;
  opacity: number;
}

function RobotPlaceholder() {
  return (
    <div className="relative flex h-[420px] w-full items-center justify-center overflow-hidden rounded-[2rem] border border-border/60 bg-background/30 backdrop-blur-xl lg:h-[560px]">
      <div className="absolute h-48 w-48 rounded-full bg-primary/15 blur-3xl" />
      <div className="relative flex flex-col items-center gap-4 text-center">
        <div className="loader scale-110" aria-hidden="true">
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </div>
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">
          Warming up 3D
        </p>
      </div>
    </div>
  );
}

export default function Hero({ stars }: { stars: Star[] }) {
  const [loadRobot, setLoadRobot] = useState(false);

  useEffect(() => {
    const load = () => setLoadRobot(true);
    const idle = window.requestIdleCallback?.(load, { timeout: 900 });
    const timer = window.setTimeout(load, 1200);

    return () => {
      window.clearTimeout(timer);
      if (idle) window.cancelIdleCallback(idle);
    };
  }, []);

  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* Mesh gradient background (theme-aware) */}
      <div className="gradient-mesh absolute inset-0 -z-10" />

      {/* Stars (subtle, dark-mode friendly) */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {stars.map((s, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-foreground"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              opacity: s.opacity * 0.6,
            }}
          />
        ))}
      </div>

      <div className="container-apple grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        {/* Left: Text */}
        <div className="relative z-10 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/50 px-3 py-1.5 text-xs font-medium backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-muted-foreground">
              Available for Internships · 🇮🇳 India
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-display gradient-text"
          >
            Hi, I&apos;m
            <br />
            Shruti Sharma
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-lg text-body text-muted-foreground lg:text-xl"
          >
            CSE student crafting modern, interactive software. Java · DSA · AI · Web.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
          >
            <MagneticButton
              onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-foreground text-background hover:opacity-90"
            >
              Explore my work
              <ArrowDown className="ml-2 h-4 w-4" />
            </MagneticButton>

            <MagneticButton
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="border border-border bg-background/40 backdrop-blur hover:bg-accent"
            >
              <Mail className="mr-2 h-4 w-4" />
              Contact
            </MagneticButton>
          </motion.div>
        </div>

        {/* Right: 3D Model */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="h-[420px] lg:h-[600px]"
        >
          {loadRobot ? (
            <Model3D
              path={`${BASE_PATH}/models/robot.glb`}
              scale={1.8}
              height={600}
              followCursor
              cameraPosition={[0, 0, 5.4]}
              floatEnabled
              animationSpeed={0.35}
              floatSpeed={0.65}
              pauseWhenOffscreen
            />
          ) : (
            <RobotPlaceholder />
          )}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs text-muted-foreground"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span>Scroll</span>
          <ArrowDown className="h-3 w-3" />
        </motion.div>
      </motion.div>
    </section>
  );
}
