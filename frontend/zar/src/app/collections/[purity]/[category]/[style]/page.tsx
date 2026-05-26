import Image from 'next/image';
import PageHeader from '@/components/ui/PageHeader/PageHeader';
import { fetchProducts } from '@/lib/api/catalog';
import catalogData from '@/lib/data/catalog.json';
import ProductListingClient from './ProductListingClient';
import styles from './page.module.css';

interface Props {
  params: Promise<{ purity: string; category: string; style: string }>;
}

export function generateStaticParams() {
  const catalog = catalogData as {
    purities: { purity: string; categories: { slug: string; styles: { slug: string }[] }[] }[];
  };
  return catalog.purities.flatMap((p) =>
    p.categories.flatMap((c) =>
      c.styles.map((s) => ({ purity: p.purity, category: c.slug, style: s.slug }))
    )
  );
}

function formatName(slug: string) {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export async function generateMetadata({ params }: Props) {
  const { purity, category, style } = await params;
  const purityLabel = purity.toUpperCase();
  const categoryName = formatName(category);
  const styleName = formatName(style);

  return {
    title: `${styleName} ${categoryName} in ${purityLabel} Gold — Zar Jewels`,
    description: `Shop our exclusive ${styleName} ${categoryName} collection crafted in ${purityLabel} gold.`,
  };
}

export default async function ProductListingPage({ params }: Props) {
  const { purity, category, style } = await params;
  const purityLabel = purity.toUpperCase();
  const categoryName = formatName(category);
  const styleName = formatName(style);

  const products = await fetchProducts(purity, category, style)
    .then((items) =>
      items.map((item) => ({
        id: item.id,
        title: item.name,
        description: item.description,
        image: item.image,
        price: item.price,
      }))
    )
    .catch(() => []);

  return (
    <div className={styles.page}>
      <PageHeader
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: `${purityLabel} Gold`, href: `/collections/${purity}` },
          { label: categoryName, href: `/collections/${purity}/${category}` },
          { label: styleName, isActive: true },
        ]}
      />
      <div className="bannerImage">
        <Image
          src="/images/about/about_banner.webp"
          alt="Crafting gold bangle"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>
      <ProductListingClient
        heading={`${styleName} ${categoryName}`}
        description={`The ${styleName} collection brings together the sparkle of Cubic Zircon (CZ) stones with the radiance of gold. The resulting product is a beautiful amalgamation of signity handwork on a gold bangle, giving it a truly exquisite look.`}
        products={products}
      />
    </div>
  );
}
