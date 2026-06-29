import { LegalPage } from "@/components/LegalPage";

export default function PrivacyPolicy() {
  return <LegalPage title="Privacy policy">
    <p>We collect information you submit, such as your email address, plus basic analytics and transaction references needed to operate this site and deliver purchased guides.</p>
    <h2>How information is used</h2><p>We use it to fulfil orders, answer support requests, measure site performance, prevent abuse, and send opted-in updates. We do not sell personal information.</p>
    <h2>Processors and retention</h2><p>Hosting, analytics, database, workflow, email, and payment providers process limited data for us. Payment card or UPI credentials are handled by the payment provider, not this site. Operational records are retained only as long as reasonably needed for fulfilment, tax, fraud prevention, and legal obligations.</p>
    <h2>Your choices</h2><p>You may unsubscribe using an email link or contact us to request access, correction, or deletion where applicable. Browser controls can limit cookies and analytics.</p>
  </LegalPage>;
}
