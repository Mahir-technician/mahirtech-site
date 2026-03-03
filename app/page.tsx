"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CaseStudyModal } from "./components/CaseStudyModal";
import { ContactForm } from "./components/ContactForm";
import { MagneticButton } from "./components/MagneticButton";
import { Reveal } from "./components/Motion";
import { Navbar } from "./components/Navbar";
import { cases, faqs, plans, processSteps, services } from "./components/data";

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setCount(target);
      return;
    }

    let current = 0;
    const increment = Math.ceil(target / 40);
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, 26);

    return () => clearInterval(timer);
  }, [inView, target, reduced]);

  return (
    <p ref={ref} className="text-4xl font-semibold text-accent">
      {count}
      {suffix}
    </p>
  );
}

export default function Home() {
  const [activeCase, setActiveCase] = useState<(typeof cases)[number] | null>(null);
  const reduced = useReducedMotion();

  return (
    <main>
      <Navbar />

      <section className="section pt-24">
        <motion.p
          initial={reduced ? {} : { opacity: 0, y: 14 }}
          animate={reduced ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-sm uppercase tracking-[0.2em] text-muted"
        >
          Premium Web Systems for International Growth
        </motion.p>
        <motion.h1
          initial={reduced ? {} : { opacity: 0, y: 16 }}
          animate={reduced ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="mt-4 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl"
        >
          We design and build high-converting digital experiences that win clients.
        </motion.h1>
        <motion.p
          initial={reduced ? {} : { opacity: 0, y: 16 }}
          animate={reduced ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16 }}
          className="mt-6 max-w-2xl text-lg text-muted"
        >
          MahirTech helps service businesses grow through web development, accurate tracking, and smart automation.
        </motion.p>
        <motion.div
          initial={reduced ? {} : { opacity: 0, y: 16 }}
          animate={reduced ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24 }}
          className="mt-8 flex flex-wrap gap-4"
        >
          <MagneticButton href="#contact">Book a Free Consultation</MagneticButton>
          <Link href="#work" className="focus-ring rounded-full border border-white/20 px-6 py-3 text-sm font-medium">
            View Work
          </Link>
        </motion.div>
      </section>

      <section id="services" className="section">
        <Reveal>
          <h2 className="text-3xl font-semibold">What we do</h2>
        </Reveal>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {services.map((service, idx) => (
            <Reveal key={service.title} delay={idx * 0.06}>
              <article className="card group h-full p-6 hover:-translate-y-1 hover:border-accent/40 hover:shadow-glow">
                <h3 className="text-xl font-medium">{service.title}</h3>
                <p className="mt-3 text-sm text-muted">{service.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="work" className="section">
        <Reveal>
          <h2 className="text-3xl font-semibold">Featured Work</h2>
        </Reveal>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {cases.map((item, idx) => (
            <Reveal key={item.title} delay={idx * 0.06}>
              <button
                onClick={() => setActiveCase(item)}
                className="card focus-ring h-full p-6 text-left hover:-translate-y-1 hover:border-accent/45 hover:shadow-glow"
              >
                <h3 className="text-lg font-medium">{item.title}</h3>
                <p className="mt-2 text-sm text-muted">{item.outcome}</p>
                <p className="mt-4 text-xs uppercase tracking-wide text-accent">View case study</p>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="process" className="section">
        <Reveal>
          <h2 className="text-3xl font-semibold">Our Process</h2>
        </Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {processSteps.map((step, idx) => (
            <Reveal key={step} delay={idx * 0.08}>
              <div className="card relative p-5">
                <p className="text-xs uppercase tracking-wide text-muted">Step {idx + 1}</p>
                <p className="mt-2 text-lg font-medium">{step}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="pricing" className="section">
        <Reveal>
          <h2 className="text-3xl font-semibold">Packages</h2>
        </Reveal>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {plans.map((plan, idx) => (
            <Reveal key={plan.name} delay={idx * 0.05}>
              <article className={`card h-full p-6 ${plan.popular ? "border-accent/50 shadow-glow" : ""}`}>
                {plan.popular && (
                  <p className="mb-4 inline-flex rounded-full border border-accent/50 px-3 py-1 text-xs text-accent">Most Popular</p>
                )}
                <h3 className="text-xl font-medium">{plan.name}</h3>
                <p className="mt-2 text-2xl font-semibold">{plan.price}</p>
                <ul className="mt-4 space-y-2 text-sm text-muted">
                  {plan.features.map((f) => (
                    <li key={f}>• {f}</li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section">
        <Reveal>
          <h2 className="text-3xl font-semibold">Proof & Trust</h2>
        </Reveal>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="card p-6">
            <Counter target={45} suffix="+" />
            <p className="mt-2 text-sm text-muted">Projects delivered</p>
          </div>
          <div className="card p-6">
            <Counter target={28} suffix="%" />
            <p className="mt-2 text-sm text-muted">Average conversion uplift</p>
          </div>
          <div className="card p-6">
            <Counter target={12} suffix=" countries" />
            <p className="mt-2 text-sm text-muted">Clients served globally</p>
          </div>
        </div>
        <p className="mt-6 text-sm text-muted">Tools we work with: Next.js, GA4, GTM, HubSpot, Airtable, Make, Vercel. References available on request.</p>
      </section>

      <section id="faq" className="section">
        <Reveal>
          <h2 className="text-3xl font-semibold">FAQ</h2>
        </Reveal>
        <div className="mt-8 space-y-3">
          {faqs.map(([q, a], idx) => (
            <Reveal key={q} delay={idx * 0.04}>
              <details className="card p-5">
                <summary className="cursor-pointer list-none font-medium">{q}</summary>
                <p className="mt-3 text-sm text-muted">{a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="contact" className="section pb-24">
        <Reveal>
          <h2 className="text-3xl font-semibold">Let&apos;s build your growth engine.</h2>
          <p className="mt-3 max-w-xl text-sm text-muted">
            Tell us where you are now and where you want to be. We&apos;ll propose the fastest path to impact.
          </p>
        </Reveal>
        <div className="mt-8">
          <ContactForm />
        </div>
      </section>

      <CaseStudyModal active={activeCase} onClose={() => setActiveCase(null)} />
    </main>
  );
}