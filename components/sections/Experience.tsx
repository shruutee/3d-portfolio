"use client";

import { motion } from "framer-motion";
import ScrollReveal from "@/components/ui/ScrollReveal";

const items = [
  {
    icon: "CV",
    title: "C. V. Raman Global University",
    desc: "Computer Science Engineering",
    color: "primary",
    bar: "bg-primary",
    bg: "bg-primary/10",
    text: "text-primary",
    tag: "2023 - 2027",
  },
  {
    icon: "SD",
    title: "Software Development Journey",
    desc: "Frontend Development / Java / Problem Solving",
    color: "fuchsia",
    bar: "bg-fuchsia-500",
    bg: "bg-fuchsia-500/10",
    text: "text-fuchsia-500",
    tag: "2025 - Present",
  },
  {
    icon: "AI",
    title: "Projects & Innovation",
    desc: "3D Portfolio / AI-Based Applications / Real-World Projects",
    color: "emerald",
    bar: "bg-emerald-500",
    bg: "bg-emerald-500/10",
    text: "text-emerald-500",
    tag: "2025 - Present",
  },
  {
    icon: "DS",
    title: "Continuous Learning",
    desc: "Data Structures & Algorithms (Striver Sheet) / Modern Web Tech",
    color: "amber",
    bar: "bg-amber-500",
    bg: "bg-amber-500/10",
    text: "text-amber-500",
    tag: "2025 - Present",
  },
];

export default function Experience() {
  return (
    <section
      id="experience"
      className="py-32"
      aria-labelledby="experience-heading"
    >
      <div className="container-apple max-w-4xl">
        <ScrollReveal>
          <div className="mb-16 text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Journey
            </span>
            <h2
              id="experience-heading"
              className="text-headline gradient-text mt-4"
            >
              Experience &amp; goals
            </h2>
          </div>
        </ScrollReveal>

        <div className="space-y-4">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ x: 8 }}
              className="group flex items-center gap-5 rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-xl transition-colors hover:bg-accent/40"
            >
              <div className={`h-full w-1 rounded-full ${item.bar}`} />

              <div
                className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl text-3xl ${item.bg}`}
              >
                {item.icon}
              </div>

              <div className="flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-3">
                  <h3 className="text-base font-semibold sm:text-lg">
                    {item.title}
                  </h3>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${item.bg} ${item.text}`}
                  >
                    {item.tag}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
