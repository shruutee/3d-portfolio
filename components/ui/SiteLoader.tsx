"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function SiteLoader({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-background"
          role="status"
          aria-live="polite"
        >
          <div className="flex flex-col items-center gap-6 px-6 text-center">
            <div className="relative h-14 w-14">
              <div className="absolute inset-0 rounded-full border border-border" />
              <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-primary" />
            </div>
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-primary">
                Loading
              </p>
              <h1 className="mt-3 text-2xl font-semibold text-foreground md:text-3xl">
                Good things take time
              </h1>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
