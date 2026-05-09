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
          className="loading-screen"
          role="status"
          aria-live="polite"
        >
          <div className="loading-card">
            <div className="loader" aria-hidden="true">
              <span className="bar" />
              <span className="bar" />
              <span className="bar" />
              <span className="bar" />
            </div>

            <p className="loading-text">Good things take time</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
