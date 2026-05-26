'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import AppLoader from '@/components/ui/organisms/AppLoader/AppLoader';
import { preloadShowcaseModels } from '@/lib/model-showcase';
import styles from './FirstVisitLoader.module.css';

const MIN_LOADER_DURATION_MS = 2000;
const MAX_LOADER_DURATION_MS = 5000;
const INITIAL_MODEL_PRELOAD_COUNT = 3;

export default function FirstVisitLoader() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [isVisible, setIsVisible] = useState(isHomePage);

  useEffect(() => {
    if (!isHomePage) {
      return;
    }

    const showTimer = window.setTimeout(() => {
      setIsVisible(true);
    }, 0);

    return () => {
      window.clearTimeout(showTimer);
    };
  }, [isHomePage]);

  useEffect(() => {
    if (!isHomePage) {
      return;
    }

    let isCancelled = false;
    const maxTimer = window.setTimeout(() => {
      if (!isCancelled) {
        setIsVisible(false);
      }
    }, MAX_LOADER_DURATION_MS);

    Promise.all([
      preloadShowcaseModels(INITIAL_MODEL_PRELOAD_COUNT),
      new Promise((resolve) => window.setTimeout(resolve, MIN_LOADER_DURATION_MS)),
    ]).then(() => {
      if (isCancelled) {
        return;
      }

      window.clearTimeout(maxTimer);
      setIsVisible(false);
    });

    return () => {
      isCancelled = true;
      window.clearTimeout(maxTimer);
    };
  }, [isHomePage]);

  if (!isHomePage || !isVisible) {
    return null;
  }

  return (
    <div className={styles.overlay} role="status" aria-live="polite" aria-label="Loading application">
      <AppLoader
        delayMs={0}
        size={150}
        label="Loading application"
        showLabel={false}
        src="/animations/loader.json"
      />
    </div>
  );
}
