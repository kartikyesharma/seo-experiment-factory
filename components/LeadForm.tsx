"use client";

import { FormEvent, useState } from "react";
import { track } from "@/lib/analytics";

export function LeadForm({ siteId, source }: { siteId: string; source: string }) {
  const [status, setStatus] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));
    track("form_submit", { source });
    const webhook = process.env.NEXT_PUBLIC_LEAD_WEBHOOK_URL;
    if (!webhook) {
      setStatus("Thanks — lead capture is in preview mode.");
      form.reset();
      return;
    }
    try {
      const response = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, siteId, source, consentedAt: new Date().toISOString() })
      });
      if (!response.ok) throw new Error("submission failed");
      setStatus("Thank you. Please check your inbox.");
      form.reset();
    } catch {
      setStatus("We could not save this right now. Please try again.");
    }
  }

  return (
    <form className="lead-form" onSubmit={submit}>
      <label htmlFor={`email-${source}`}>Get practical travel updates by email</label>
      <div className="form-row">
        <input id={`email-${source}`} name="email" type="email" required placeholder="you@example.com" />
        <button type="submit">Subscribe</button>
      </div>
      <label className="consent"><input type="checkbox" name="consent" value="yes" required /> I agree to receive these emails and can unsubscribe anytime.</label>
      <p aria-live="polite">{status}</p>
    </form>
  );
}
