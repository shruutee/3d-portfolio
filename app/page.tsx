"use client";

import { useEffect, useMemo, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";
import SiteLoader from "@/components/ui/SiteLoader";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

export default function Home() {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const loaderTimer = window.setTimeout(() => setShowLoader(false), 1200);

    return () => {
      window.clearTimeout(loaderTimer);
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
      <ErrorBoundary fallback={null}>
        <Navbar />
      </ErrorBoundary>
      <ErrorBoundary fallback={null}>
        <Hero stars={stars} />
      </ErrorBoundary>
      <ErrorBoundary fallback={null}>
        <About />
      </ErrorBoundary>
      <ErrorBoundary fallback={null}>
        <Skills />
      </ErrorBoundary>
      <ErrorBoundary fallback={null}>
        <Projects />
      </ErrorBoundary>
      <ErrorBoundary fallback={null}>
        <Experience />
      </ErrorBoundary>
      <ErrorBoundary fallback={null}>
        <Contact />
      </ErrorBoundary>
    </>
  );
}
