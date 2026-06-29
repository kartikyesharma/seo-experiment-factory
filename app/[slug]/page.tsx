import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageArticle } from "@/components/PageArticle";
import { getPage, getPages, getProducts, getSiteConfig } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPages().map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getPage(slug);
  if (!page) return {};
  return { title: page.title, description: page.description, alternates: { canonical: `/${slug}/` }, openGraph: { title: page.title, description: page.description, type: "article" } };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getPage(slug);
  if (!page) notFound();
  const product = getProducts().find((item) => item.id === page.productId);
  return <PageArticle page={page} product={product} site={getSiteConfig()} />;
}
