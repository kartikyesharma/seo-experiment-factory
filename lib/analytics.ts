export type EventName =
  | "page_view"
  | "pdf_cta_click"
  | "payment_click"
  | "service_cta_click"
  | "form_submit";

export function track(name: EventName, parameters: Record<string, string | number> = {}) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", name, parameters);
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}
