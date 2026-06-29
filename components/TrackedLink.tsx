"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { track, type EventName } from "@/lib/analytics";

export function TrackedLink({ event, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { event: EventName; children: ReactNode }) {
  return (
    <a {...props} onClick={(e) => { track(event, { destination: props.href || "" }); props.onClick?.(e); }}>
      {children}
    </a>
  );
}
