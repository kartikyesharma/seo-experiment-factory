"use client";

import { FormEvent, useState } from "react";
import { track } from "@/lib/analytics";

export function AssistanceForm({ siteId }: { siteId: string }) {
  const [status, setStatus] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));
    track("form_submit", { source: "homepage_travel_help", service: String(payload.service || "") });
    const webhook = process.env.NEXT_PUBLIC_LEAD_WEBHOOK_URL;
    if (!webhook) {
      setStatus("Enquiries are currently unavailable. Please try again later.");
      return;
    }
    try {
      const response = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, siteId, source: "homepage_travel_help", consentedAt: new Date().toISOString() })
      });
      if (!response.ok) throw new Error("submission failed");
      setStatus("Thanks. This is an enquiry only; please wait for written confirmation before making plans.");
      form.reset();
    } catch {
      setStatus("We could not save your enquiry. Please try again later.");
    }
  }

  return <form className="lead-form assistance-form" onSubmit={submit}>
    <div className="field-grid">
      <label>Name<input name="name" required autoComplete="name" /></label>
      <label>Phone<input name="phone" type="tel" required autoComplete="tel" /></label>
      <label>Email<input name="email" type="email" autoComplete="email" /></label>
      <label>Help needed<select name="service" required defaultValue=""><option value="" disabled>Select one</option><option value="hotel">Hotel enquiry</option><option value="cab">Cab enquiry</option><option value="both">Hotel and cab</option></select></label>
    </div>
    <label>Travel note<textarea name="message" rows={3} placeholder="Dates, travellers, arrival point, and what you need" /></label>
    <label className="consent"><input type="checkbox" name="consent" value="yes" required /> I consent to being contacted about this enquiry. This is not a booking confirmation.</label>
    <button type="submit">Send enquiry</button><p aria-live="polite">{status}</p>
  </form>;
}
