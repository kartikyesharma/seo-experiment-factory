import { LegalPage } from "@/components/LegalPage";
import { getSiteConfig } from "@/lib/site";

export default function RefundPolicy() {
  const site = getSiteConfig();
  return <LegalPage title="Refund policy">
    <p>Because PDFs are digital products delivered immediately, purchases are normally final after successful delivery.</p>
    <h2>When we will help</h2><p>If you were charged twice, received a corrupt or inaccessible file, or did not receive delivery, contact us within {site.legal.refundDays} days with the payment reference. We will first redeliver or replace the file and will issue an appropriate refund when the issue cannot be resolved.</p>
    <p>This policy does not limit rights that cannot be excluded under applicable consumer law. Approved refunds are returned through the original payment provider and may take several business days.</p>
  </LegalPage>;
}
