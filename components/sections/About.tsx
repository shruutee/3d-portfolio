"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import TiltCard from "@/components/ui/TiltCard";
import FloatingParticles from "@/components/ui/FloatingParticles";

const stats = [
  { num: "2027", label: "B.Tech CSE", icon: "CS" },
  { num: "2025", label: "Software Journey", icon: "SD" },
  { num: "4+", label: "Projects & Ideas", icon: "AI" },
  { num: "Now", label: "Learning DSA", icon: "DS" },
];

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const photoSources = ["/profile.jpg", "/profile.png", "/profile.webp"].map(
  (src) => `${BASE_PATH}${src}`
);

export default function About() {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [photoAvailable, setPhotoAvailable] = useState(true);
  const currentPhoto = photoSources[photoIndex];

  return (
    <section
      id="about"
      className="relative overflow-hidden py-32"
      aria-labelledby="about-heading"
    >
      <FloatingParticles count={18} />

      <div className="pointer-events-none absolute left-[-10%] top-[20%] -z-10 h-[320px] w-[320px] rounded-full bg-primary/14 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[10%] right-[-10%] -z-10 h-[360px] w-[360px] rounded-full bg-fuchsia-500/10 blur-3xl" />

      <div className="container-apple relative">
        <ScrollReveal>
          <div className="mb-16 text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              About
            </span>
            <h2 id="about-heading" className="text-headline gradient-text mt-4">
              The person behind the code
            </h2>
          </div>
        </ScrollReveal>

        <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="rounded-lg border border-border bg-card/40 p-6 text-center backdrop-blur-xl"
            >
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {stat.icon}
              </div>
              <div className="bg-gradient-to-br from-primary to-fuchsia-500 bg-clip-text text-3xl font-bold text-transparent">
                {stat.num}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        <ScrollReveal>
          <TiltCard>
            <div className="relative overflow-hidden rounded-lg border border-border bg-card/60 p-8 backdrop-blur-xl md:p-12">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-fuchsia-500 to-emerald-500" />

              <div className="grid items-start gap-8 md:grid-cols-[auto_1fr]">
                <div className="mx-auto h-32 w-32 overflow-hidden rounded-lg bg-gradient-to-br from-primary to-fuchsia-500 shadow-xl shadow-primary/30 md:mx-0">
                  {photoAvailable ? (
                    <img
                      src={currentPhoto}
                      alt="Shruti Sharma"
                      className="h-full w-full object-cover"
                      onError={() => {
                        const next = photoIndex + 1;
                        if (next < photoSources.length) {
                          setPhotoIndex(next);
                        } else {
                          setPhotoAvailable(false);
                        }
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-white">
                      SS
                    </div>
                  )}
                </div>

                <div className="space-y-5 text-center md:text-left">
                  <p className="text-body text-foreground/90">
                    Hi, I&apos;m{" "}
                    <strong className="text-primary">Shruti</strong> - I design
                    and build digital experiences. I&apos;m a Computer Science
                    student and aspiring software engineer, passionate about
                    creating modern, interactive, and user-focused applications.
                  </p>
                  <p className="text-body text-foreground/90">
                    I enjoy turning ideas into real-world projects - from
                    building 3D web experiences to developing intelligent systems
                    like AI-based simulators. My focus is on writing clean code,
                    solving complex problems, and continuously improving my
                    skills in{" "}
                    <strong className="text-fuchsia-500">
                      Data Structures, Algorithms, and modern web technologies
                    </strong>
                    .
                  </p>
                  <p className="text-body text-foreground/90">
                    I&apos;m currently working on projects that combine{" "}
                    <strong className="text-emerald-500">
                      creativity + technology
                    </strong>
                    , aiming to build impactful solutions that stand out.
                  </p>
                </div>
              </div>
            </div>
          </TiltCard>
        </ScrollReveal>
      </div>
    </section>
  );
}
