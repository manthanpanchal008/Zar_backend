'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/atoms/Button/Button';
import styles from './MegaMenu.module.css';
import { cn } from '@/lib/utils';

const ktFilters = [
  { label: '18 KT Jewellery', value: '18kt' },
  { label: '22 KT Jewellery', value: '22kt' },
];

interface Category {
  label: string;
  href: string;
  image: string;
}

const categoriesByKt: Record<string, Category[]> = {
  '22kt': [
    { label: 'Bangles & Bracelet', href: '/collections/22k/bangles-bracelet', image: '/images/menu/menu-1.png' },
    { label: 'Mangalsutra & Necklace', href: '/collections/22k/mangalsutra-necklace', image: '/images/menu/menu-2.png' },
    { label: 'Mens Jewellery', href: '/collections/22k/mens-jewellery', image: '/images/menu/menu-3.png' },
    { label: 'Earrings', href: '/collections/22k/earrings', image: '/images/menu/menu-4.png' },
    { label: 'Kids Jewellery', href: '/collections/22k/kids-jewellery', image: '/images/menu/menu-5.png' },
    { label: 'Lightweight Jewellery', href: '/collections/22k/lightweight-jewellery', image: '/images/menu/menu-8.png' },
  ],
  '18kt': [
    { label: 'Bangles & Bracelet', href: '/collections/18k/bangles-bracelet', image: '/images/menu/menu-1.png' },
    { label: 'Mangalsutra & Necklace', href: '/collections/18k/mangalsutra-necklace', image: '/images/menu/menu-2.png' },
    { label: 'Lightweight Jewellery', href: '/collections/18k/lightweight-jewellery', image: '/images/menu/menu-3.png' },
    { label: 'Earrings', href: '/collections/18k/earrings', image: '/images/menu/menu-4.png' },
    { label: 'Rings', href: '/collections/18k/rings', image: '/images/menu/menu-5.png' },
    { label: 'Kids Jewellery', href: '/collections/18k/kids-jewellery', image: '/images/menu/menu-6.png' },
  ],
};

interface MegaMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function MegaMenu({ open, onClose }: MegaMenuProps) {
  const [activeKt, setActiveKt] = useState('18kt');

  const categories = categoriesByKt[activeKt] ?? categoriesByKt['18kt'];

  const overlayClass = cn(styles.overlay, open && styles.overlayOpen);

  return (
    <div className={overlayClass}>
      <div className={styles.inner}>
        <div className={styles.sidebar}>
          {ktFilters.map((kt) => (
            <button
              key={kt.value}
              type="button"
              className={cn(styles.ktCard, activeKt === kt.value && styles.ktCardActive)}
              onClick={() => setActiveKt(kt.value)}
              style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
              aria-pressed={activeKt === kt.value}
            >
              <div className={styles.ktCardImageWrap}>
                <Image
                  src={kt.value === '18kt' ? '/images/menu/18k_menu.png' : '/images/menu/22kt_menu.png'}
                  alt={kt.label}
                  width={70}
                  height={70}
                />
              </div>
              <div className={styles.ktCardText}>
                <div className={styles.ktCardTitle}>
                  {kt.value === '18kt' ? '18' : '22'} <span className={styles.ktCardKt}>KT</span>
                </div>
                <div className={styles.ktCardSubtitle}>
                  {kt.value === '18kt' ? 'Contemporary Gold' : 'Classic Gold'}
                </div>
              </div>
              <div className={styles.ktCardPara}>
                {kt.value === '18kt'
                  ? 'Modern silhouettes, precise Italian design, and two-tone finishes for the minimalist.'
                  : 'Traditional craftsmanship meets everyday luxury in our signature high-purity collections.'}
              </div>
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          {categories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className={styles.categoryCard}
              onClick={onClose}
            >
              <div className={styles.categoryImage}>
                <Image src={cat.image} alt={cat.label} fill sizes="230px" />
              </div>
              <span className={styles.categoryName}>{cat.label}</span>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
