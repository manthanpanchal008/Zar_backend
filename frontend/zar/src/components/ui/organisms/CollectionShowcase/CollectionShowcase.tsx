'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/atoms/Button/Button';
import CollectionCard from '@/components/ui/molecules/CollectionCard/CollectionCard';
import styles from './CollectionShowcase.module.css';

const collections = [
  { name: 'CLASSIC', slug: 'classic', image: '/images/homepage/product_1.webp' },
  { name: 'DAZZLING', slug: 'dazzling', image: '/images/homepage/product_2.webp' },
  { name: 'HERITAGE', slug: 'heritage', image: '/images/homepage/product_3.webp' },
  { name: 'ROYAL', slug: 'royal', image: '/images/homepage/product_1.webp' },
  { name: 'ETERNAL', slug: 'eternal', image: '/images/homepage/product_3.webp' },
];

function getVisibleIndices(active: number, total: number) {
  const prev = (active - 1 + total) % total;
  const next = (active + 1) % total;
  return { prev, next };
}

const slideVariants = {
  enterFromRight: { x: 120, opacity: 0, scale: 0.85 },
  enterFromLeft: { x: -120, opacity: 0, scale: 0.85 },
  center: { x: 0, opacity: 1, scale: 1 },
  exitToLeft: { x: -120, opacity: 0, scale: 0.85 },
  exitToRight: { x: 120, opacity: 0, scale: 0.85 },
};

export default function CollectionShowcase() {
  const [activeIndex, setActiveIndex] = useState(1);
  const [direction, setDirection] = useState(0); // -1 = prev, 1 = next
  const total = collections.length;

  const goPrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((i) => (i - 1 + total) % total);
  }, [total]);

  const goNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((i) => (i + 1) % total);
  }, [total]);

  const { prev, next } = getVisibleIndices(activeIndex, total);

  return (
    <section className="mt-100">
      <div className={styles.inner}>
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h2 className="fs_54">Signature Gold Bangles</h2>
          <p className={styles.subtitle}>
            Discover a range of thoughtfully curated designs that balance tradition and modernity.
          </p>
          <Button href="/collections" variant="primary" showArrow>
            Explore Collections
          </Button>
        </motion.div>
        <motion.div 
          className={styles.carousel}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={`prev-${prev}`}
              className={styles.sideCard}
              initial={direction >= 0 ? 'enterFromLeft' : 'enterFromRight'}
              animate="center"
              exit={direction >= 0 ? 'exitToLeft' : 'exitToRight'}
              variants={slideVariants}
              transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            >
              <CollectionCard
                name={collections[prev].name}
                image={collections[prev].image}
                href={`/collections/${collections[prev].slug}`}
              />
            </motion.div>
            <motion.div
              key={`center-${activeIndex}`}
              className={styles.centerCard}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            >
              <CollectionCard
                name={collections[activeIndex].name}
                image={collections[activeIndex].image}
                href={`/collections/${collections[activeIndex].slug}`}
                active
              />
            </motion.div>
            <motion.div
              key={`next-${next}`}
              className={styles.sideCard}
              initial={direction >= 0 ? 'enterFromRight' : 'enterFromLeft'}
              animate="center"
              exit={direction >= 0 ? 'exitToRight' : 'exitToLeft'}
              variants={slideVariants}
              transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            >
              <CollectionCard
                name={collections[next].name}
                image={collections[next].image}
                href={`/collections/${collections[next].slug}`}
              />
            </motion.div>
          </AnimatePresence>
          <button className={`${styles.navButton} ${styles.navPrev}`} onClick={goPrev} aria-label="Previous">
            <svg viewBox="0 0 12 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 1L1 12L11 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className={`${styles.navButton} ${styles.navNext}`} onClick={goNext} aria-label="Next">
            <svg viewBox="0 0 12 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L11 12L1 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
