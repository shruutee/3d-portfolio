"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import TiltCard from "@/components/ui/TiltCard";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

const WaterScene = dynamic(() => import("@/components/3d/WaterScene"), {
  ssr: false,
  loading: () => <div className="h-[600px] w-full animate-pulse bg-muted/30" />,
});

const projects = [
  {
    title: "JobSim AI",
    icon: "AI",
    desc: "AI-based interview and job simulation platform built to recreate realistic interview environments. It helps users practice problem-solving and communication with AI-driven responses for real-world job preparation.",
    tags: ["AI", "Interview Prep", "2025"],
    gradient: "from-fuchsia-500 to-amber-500",
    featured: true,
    status: "Featured",
  },
  {
    title: "3D Interactive Portfolio",
    icon: "3D",
    desc: "Modern developer portfolio with 3D elements, smooth animations, and a performance-focused UI/UX approach. Designed to represent a personal brand with a premium feel.",
    tags: ["React", "Three.js", "Portfolio", "2025"],
    gradient: "from-primary to-fuchsia-400",
    featured: false,
    status: "Completed",
  },
  {
    title: "Java-Based Applications",
    icon: "JV",
    desc: "Core programming and problem-solving projects built with Java. These applications strengthened OOP concepts, logic building, clean code habits, and efficient solution design.",
    tags: ["Java", "OOP", "Problem Solving", "2024 - 2025"],
    gradient: "from-emerald-500 to-primary",
    featured: false,
    status: "Completed",
  },
  {
    title: "Frontend Projects",
    icon: "FE",
    desc: "Responsive websites developed using HTML, CSS, and JavaScript with a focus on modern UI design, user experience, real-world layouts, and polished design techniques.",
    tags: ["HTML", "CSS", "JavaScript", "2025"],
    gradient: "from-amber-500 to-fuchsia-500",
    featured: false,
    status: "Completed",
  },
];

function LazyWaterScene() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || visible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
        setActive(entry.isIntersecting);
      },
      { rootMargin: "220px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <div ref={ref} className="h-[600px] w-full">
      {visible ? (
        <ErrorBoundary fallback={<div className="h-full w-full bg-muted/20" aria-hidden />}>
          <WaterScene height={600} active={active} />
        </ErrorBoundary>
      ) : (
        <div className="h-full w-full bg-muted/20" aria-hidden />
      )}
    </div>
  );
}

export default function Projects() {
  return (
    <>
      {/* Cinematic 3D Section with parallax title */}
      <section
        id="projects"
        className="relative overflow-hidden"
        aria-labelledby="projects-heading"
      >
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-transparent to-background" />
        <LazyWaterScene />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-x-0 top-1/3 z-20 text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            My Work
          </span>
          <h2
            id="projects-heading"
            className="text-headline gradient-text mt-4"
          >
            Featured projects
          </h2>
        </motion.div>
      </section>

      {/* Project Cards */}
      <section className="py-20">
        <div className="container-apple">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <ScrollReveal key={project.title}>
                <TiltCard>
                  <article
                    className={`group relative h-full overflow-hidden rounded-3xl border bg-card/60 p-8 backdrop-blur-xl transition-all hover:shadow-2xl ${
                      project.featured
                        ? "border-fuchsia-500/30 shadow-lg shadow-fuchsia-500/10"
                        : "border-border"
                    }`}
                  >
                    <div
                      className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${project.gradient}`}
                    />

                    <div className="mb-6 flex items-start justify-between">
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${project.gradient} text-2xl shadow-lg`}
                      >
                        {project.icon}
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${
                          project.featured
                            ? "border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-500"
                            : "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                        }`}
                      >
                        {project.featured && <Sparkles className="h-3 w-3" />}
                        {project.status}
                      </span>
                    </div>

                    <h3 className="mb-3 flex items-center gap-2 text-2xl font-semibold">
                      {project.title}
                      <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                    </h3>

                    <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                      {project.desc}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </article>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
