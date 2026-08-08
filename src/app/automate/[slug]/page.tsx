import { notFound } from "next/navigation";
import Link from "next/link";
import { getOfferingBySlug, getWaitlistOfferingSlugs, type OfferingMetadata } from "@/lib/checkout";
import Breadcrumb from "@/components/automate/Breadcrumb";
import OfferingDetailBody from "./OfferingDetailBody";
import styles from "./page.module.css";

export const dynamicParams = false;

export async function generateStaticParams() {
  return getWaitlistOfferingSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const offering = getOfferingBySlug(slug);
  if (!offering) return {};

  return {
    title: `${offering.name} | Asor Ahura`,
    description: offering.description,
  };
}

export default async function OfferingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const offering: OfferingMetadata | null = getOfferingBySlug(slug);

  if (!offering) notFound();

  return (
    <main className={styles.main}>
      <div className="container">
        <Breadcrumb offeringName={offering.name} />

        <header className={styles.hero}>
          <h1 className={styles.heroHeadline}>{offering.heroHeadline}</h1>
          <p className={styles.heroSubheading}>{offering.heroSubheading}</p>
        </header>

        <OfferingDetailBody offering={offering} />

        <div className={styles.backLinkWrapper}>
          <Link href="/automate" className={styles.backLink}>
            See all 5 automations
          </Link>
        </div>
      </div>
    </main>
  );
}
