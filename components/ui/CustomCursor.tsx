"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 500, damping: 28, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 500, damping: 28, mass: 0.5 });

  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const [touch, setTouch] = useState(false);

  useEffect(() => {
    // Hide on touch devices
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    setTouch(isTouch);
    if (isTouch) return;

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const leave = () => setVisible(false);

    const handleEnter = () => setHovering(true);
    const handleLeave = () => setHovering(false);

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", leave);

    const interactive = document.querySelectorAll(
      "a, button, input, textarea, [data-cursor-hover]"
    );
    interactive.forEach((el) => {
      el.addEventListener("mouseenter", handleEnter);
      el.addEventListener("mouseleave", handleLeave);
    });

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
      interactive.forEach((el) => {
        el.removeEventListener("mouseenter", handleEnter);
        el.removeEventListener("mouseleave", handleLeave);
      });
    };
  }, [x, y]);

  if (touch) return null;

  return (
    <>
      <motion.div
        style={{ x: springX, y: springY, opacity: visible ? 1 : 0 }}
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block"
        aria-hidden
      >
        <motion.div
          animate={{
            width: hovering ? 48 : 28,
            height: hovering ? 48 : 28,
            backgroundColor: hovering
              ? "hsl(var(--primary) / 0.15)"
              : "transparent",
          }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="-translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/60"
          style={{ mixBlendMode: "difference" }}
        />
      </motion.div>

      <motion.div
        style={{ x, y, opacity: visible ? 1 : 0 }}
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block"
        aria-hidden
      >
        <div className="-translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-primary" />
      </motion.div>
    </>
  );
}