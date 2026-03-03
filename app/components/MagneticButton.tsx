"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

export function MagneticButton({ href, children }: { href: string; children: React.ReactNode }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      onMouseMove={(e) => {
        if (reduced) return;
        const target = e.currentTarget as HTMLDivElement;
        const rect = target.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        target.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translate(0px, 0px)";
      }}
      className="inline-block transition-transform duration-200"
    >
      <Link
        href={href}
        className="focus-ring inline-flex items-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-base shadow-glow"
      >
        {children}
      </Link>
    </motion.div>
  );
}