"use client";

import { useMemo } from "react";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";
import SiteLoader from "@/components/ui/SiteLoader";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

// Lazy-load the assistant after the main page becomes interactive.
const Chatbot = dynamic(() => import("@/components/ui/Chatbot"), { ssr: false });

export default function Home() {
  const [showLoader, setShowLoader] = useState(true);
  const [loadExtras, setLoadExtras] = useState(false);

  useEffect(() => {
    const loaderTimer = window.setTimeout(() => setShowLoader(false), 1200);
    const idle = window.requestIdleCallback?.(
      () => setLoadExtras(true),
      { timeout: 2500 }
    );
    const extrasTimer = window.setTimeout(() => setLoadExtras(true), 2800);

    return () => {
      window.clearTimeout(loaderTimer);
      window.clearTimeout(extrasTimer);
      if (idle) window.cancelIdleCallback(idle);
    };
  }, []);

  // Stable star positions (no hydration mismatch)
  const stars = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => {
        // Deterministic pseudo-random using index
        const seed = (n: number) => Math.abs(Math.sin(i * (n + 1)) * 10000) % 1;
        return {
          left: seed(1) * 100,
          top: seed(2) * 100,
          size: 1 + seed(3) * 2,
          opacity: 0.3 + seed(4) * 0.7,
        };
      }),
    []
  );

  return (
    <>
      <SiteLoader show={showLoader} />
      <Navbar />
      <Hero stars={stars} />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Contact />
      {loadExtras && (
        <ErrorBoundary fallback={null}>
          <Chatbot />
        </ErrorBoundary>
      )}
    </>
  );
}
