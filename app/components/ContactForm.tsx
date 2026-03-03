"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      setStatus("Thanks! We will get back to you within 1 business day.");
      e.currentTarget.reset();
    } else {
      setStatus("Something went wrong. Please email hello@mahirtech.com directly.");
    }

    setLoading(false);
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <input required name="name" placeholder="Your name" className="focus-ring rounded-xl border border-white/15 bg-base p-3" />
        <input required type="email" name="email" placeholder="Work email" className="focus-ring rounded-xl border border-white/15 bg-base p-3" />
      </div>
      <input name="company" placeholder="Company" className="focus-ring w-full rounded-xl border border-white/15 bg-base p-3" />
      <textarea
        required
        name="message"
        placeholder="Tell us about your project goals"
        rows={4}
        className="focus-ring w-full rounded-xl border border-white/15 bg-base p-3"
      />
      <button
        disabled={loading}
        className="focus-ring rounded-full bg-accent px-5 py-3 text-sm font-semibold text-base shadow-glow disabled:opacity-60"
      >
        {loading ? "Sending..." : "Start a Project"}
      </button>
      {status && <p className="text-sm text-muted">{status}</p>}
      <p className="text-xs text-muted">Or contact us: hello@mahirtech.com · WhatsApp: +880-1XXX-XXXXXX</p>
    </form>
  );
}