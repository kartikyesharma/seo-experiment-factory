"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { track } from "@/lib/analytics";

export function Analytics() {
  const pathname = usePathname();
  const id = process.env.NEXT_PUBLIC_GA4_ID;

  useEffect(() => {
    track("page_view", { page_path: pathname });
  }, [pathname]);

  if (!id) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', '${id}', { send_page_view: false });
      `}</Script>
    </>
  );
}
