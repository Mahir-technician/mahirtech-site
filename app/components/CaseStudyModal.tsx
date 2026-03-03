"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type CaseData = {
  title: string;
  problem: string;
  solution: string;
  stack: string;
  outcome: string;
};

export function CaseStudyModal({
  active,
  onClose
}: {
  active: CaseData | null;
  onClose: () => void;
}) {
  const reduced = useReducedMotion();
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.article
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 16, scale: 0.98 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="card w-full max-w-2xl p-6"
          >
            <h3 className="text-2xl font-semibold">{active.title}</h3>
            <div className="mt-4 space-y-3 text-sm text-muted">
              <p>
                <span className="font-medium text-text">Problem:</span> {active.problem}
              </p>
              <p>
                <span className="font-medium text-text">Solution:</span> {active.solution}
              </p>
              <p>
                <span className="font-medium text-text">Stack:</span> {active.stack}
              </p>
              <p>
                <span className="font-medium text-text">Outcome:</span> {active.outcome}
              </p>
            </div>
            <button onClick={onClose} className="focus-ring mt-6 rounded-full border border-white/20 px-4 py-2 text-sm">
              Close
            </button>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}