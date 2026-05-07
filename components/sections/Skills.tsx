"use client";

import { motion } from "framer-motion";
import ScrollReveal from "@/components/ui/ScrollReveal";

const categories = [
  {
    title: "Programming Languages",
    icon: "PL",
    color: "primary",
    accent: "from-primary/20 to-primary/5",
    skills: ["Java", "JavaScript"],
  },
  {
    title: "Frontend Development",
    icon: "FE",
    color: "fuchsia-500",
    accent: "from-fuchsia-500/20 to-fuchsia-500/5",
    skills: ["HTML5", "CSS3", "JavaScript (ES6+)", "Tailwind CSS"],
  },
  {
    title: "Frameworks & Libraries",
    icon: "FW",
    color: "emerald-500",
    accent: "from-emerald-500/20 to-emerald-500/5",
    skills: ["React.js", "Three.js", "React Three Fiber"],
  },
  {
    title: "Development Tools",
    icon: "DT",
    color: "amber-500",
    accent: "from-amber-500/20 to-amber-500/5",
    skills: ["VS Code", "Git", "GitHub"],
  },
  {
    title: "Backend & Database",
    icon: "DB",
    color: "primary",
    accent: "from-primary/20 to-primary/5",
    skills: ["Node.js (Basics)", "JDBC", "SQL"],
  },
  {
    title: "Other Technologies",
    icon: "3D",
    color: "fuchsia-500",
    accent: "from-fuchsia-500/20 to-fuchsia-500/5",
    skills: ["3D Models Integration", "Responsive Web Design", "REST APIs (Basics)"],
  },
  {
    title: "Currently Learning",
    icon: "CL",
    color: "emerald-500",
    accent: "from-emerald-500/20 to-emerald-500/5",
    skills: ["Data Structures & Algorithms", "Advanced JavaScript", "Modern Web Development"],
  },
];

export default function Skills() {
  return (
    <section
      id="skills"
      className="relative py-32"
      aria-labelledby="skills-heading"
    >
      <div className="container-apple">
        <ScrollReveal>
          <div className="mb-16 text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Skills
            </span>
            <h2
              id="skills-heading"
              className="text-headline gradient-text mt-4"
            >
              What I&apos;m good at
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-xl transition-all hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10"
            >
              <div
                className={`absolute inset-0 -z-10 bg-gradient-to-br ${cat.accent} opacity-0 transition-opacity group-hover:opacity-100`}
              />

              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-2xl">
                {cat.icon}
              </div>

              <h3 className="mb-4 text-lg font-semibold">{cat.title}</h3>

              <div className="space-y-2">
                {cat.skills.map((s) => (
                  <div
                    key={s}
                    className="rounded-lg bg-muted/50 px-3 py-2 text-sm text-foreground/80"
                  >
                    {s}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
