'use client';

import { useEffect } from 'react';
import { motion, useAnimationControls, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const controls = useAnimationControls();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      controls.set({ opacity: 1, y: 0, filter: 'none' });
      return;
    }

    controls.set({ opacity: 0, y: 14, filter: 'blur(4px)' });
    void controls.start({
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.32, ease: [0.2, 0.8, 0.2, 1] },
    });
  }, [controls, pathname, prefersReducedMotion]);

  return (
    <motion.div
      className="page-transition-shell"
      initial={false}
      animate={controls}
    >
      {children}
    </motion.div>
  );
}
