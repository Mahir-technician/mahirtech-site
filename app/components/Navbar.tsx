"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { navItems } from "./data";

export function Navbar() {
  const [active, setActive] = useState("services");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { threshold: 0.4 }
    );

    navItems.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-base/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="#" className="focus-ring text-lg font-semibold">
          MahirTech
        </Link>
        <ul className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <li key={item.id}>
              <Link
                href={`#${item.id}`}
                className={`focus-ring text-sm transition ${active === item.id ? "text-accent" : "text-muted hover:text-text"}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="#contact"
          className="focus-ring rounded-full border border-accent/40 px-4 py-2 text-sm text-accent hover:bg-accent/10"
        >
          Book Call
        </Link>
      </nav>
    </header>
  );
}