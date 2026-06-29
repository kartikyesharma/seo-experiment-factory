export type Cta = { label: string; url: string; disclosure?: string };

export type SiteConfig = {
  id: string;
  name: string;
  domain: string;
  language: string;
  locale: string;
  description: string;
  author: string;
  supportEmail: string;
  accent: string;
  officialLinks: Array<{ label: string; url: string }>;
  serviceCta?: Cta;
  affiliateCta?: Cta;
  legal: { businessName: string; jurisdiction: string; refundDays: number };
};

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: "INR";
  paymentLink: string;
  pdfUrl: string;
  sourceMarkdown: string;
  deliveryEmailTemplate: {
    subject: string;
    body: string;
  };
};

export type SeoPage = {
  slug: string;
  title: string;
  description: string;
  keyword: string;
  updated: string;
  productId?: string;
  body: string;
  faq: Array<{ question: string; answer: string }>;
};
