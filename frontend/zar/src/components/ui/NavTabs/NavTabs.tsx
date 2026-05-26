"use client";
import styles from './NavTabs.module.css';
import React from 'react';

type Nation = 'uae' | 'india';
interface NavTabsProps {
  selectedNation: Nation;
  setSelectedNation: (nation: Nation) => void;
}

export default function NavTabs({ selectedNation, setSelectedNation }: NavTabsProps) {
  return (
    <div className={styles.tabWrapper}>
      <button
        type="button"
        className={selectedNation === 'uae' ? styles.activeTab : styles.inactiveTab}
        onClick={() => setSelectedNation('uae')}
      >
        UAE
      </button>
      <button
        type="button"
        className={selectedNation === 'india' ? styles.activeTab : styles.inactiveTab}
        onClick={() => setSelectedNation('india')}
      >
        India
      </button>
    </div>
  );
}
