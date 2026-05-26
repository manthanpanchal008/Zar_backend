'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Logo from '@/components/ui/atoms/Logo/Logo';
import MegaMenu from '@/components/ui/organisms/MegaMenu/MegaMenu';
import styles from './Header.module.css';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleCart } from '@/features/cart/cartSlice';

export default function Header() {
  const dispatch = useAppDispatch();
  const cartCount = useAppSelector((state) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileCollectionsOpen, setMobileCollectionsOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const megaMenuTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 50);
      if (currentY > 100 && currentY > lastScrollY.current) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const openMegaMenu = useCallback(() => {
    if (megaMenuTimeout.current) clearTimeout(megaMenuTimeout.current);
    setMegaMenuOpen(true);
  }, []);

  const closeMegaMenu = useCallback(() => {
    megaMenuTimeout.current = setTimeout(() => setMegaMenuOpen(false), 100);
  }, []);

  const handleMegaMenuEnter = useCallback(() => {
    if (megaMenuTimeout.current) clearTimeout(megaMenuTimeout.current);
  }, []);

  const handleMegaMenuLeave = useCallback(() => {
    megaMenuTimeout.current = setTimeout(() => setMegaMenuOpen(false), 100);
  }, []);

  useEffect(() => {
    // console.log('megaMenuOpen state:', megaMenuOpen);
  }, [megaMenuOpen]);

  useEffect(() => {
    if (!menuOpen) {
      setMobileCollectionsOpen(false);
    }
  }, [menuOpen]);

  return (
    <>
      <header className={cn(styles.header, scrolled && styles.headerScrolled, hidden && styles.headerHidden)}>
        <div className={styles.inner}>
          <Logo />
          <div className={styles.nav}>
            <nav className={styles.navLinks}>
              <ul className={styles.menuList}>
                <li>
                  <Link href="/about">Story of Zar</Link>
                </li>
                <li
                  className={styles.collectionsItem}
                  onMouseEnter={openMegaMenu}
                  onMouseLeave={closeMegaMenu}
                >
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    Collections
                    <span className={styles.chevron}>
                      <svg viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5.5 5L10 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </a>
                  <div className={styles.dropdown}>
                    <div
                      onMouseEnter={handleMegaMenuEnter}
                      onMouseLeave={handleMegaMenuLeave}
                    >
                      <MegaMenu open={megaMenuOpen} onClose={() => setMegaMenuOpen(false)} />
                    </div>
                  </div>
                </li>
                <li>
                  <Link href="/clientele">Our Clientele</Link>
                </li>
                <li>
                  <Link href="/partner">Become a Partner</Link>
                </li>
                <li>
                  <Link href="/careers">Careers</Link>
                </li>
                <li>
                  <Link href="/contact">Contact</Link>
                </li>
              </ul>
            </nav>
            <div className={styles.cta}>
              <button
                className={styles.cartIcon}
                onClick={() => dispatch(toggleCart())}
                aria-label={`Open cart (${cartCount} items)`}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {cartCount > 0 && (
                  <span className={styles.cartBadge}>{cartCount}</span>
                )}
              </button>
            </div>
            <button
              className={cn(styles.hamburger, menuOpen && styles.hamburgerOpen)}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        {/* Mobile slide-down menu — lives inside <header> so it tracks fixed position */}
        <div className={cn(styles.mobileMenu, menuOpen && styles.mobileMenuOpen)}>
          <ul className={styles.mobileMenuList}>
            <li><Link href="/about" onClick={() => setMenuOpen(false)}>Story of Zar</Link></li>
            <li className={styles.mobileCollectionsItem}>
              <button
                type="button"
                className={styles.mobileCollectionsToggle}
                onClick={() => setMobileCollectionsOpen((prev) => !prev)}
                aria-expanded={mobileCollectionsOpen}
              >
                Collections
                <span className={cn(styles.mobileChevron, mobileCollectionsOpen && styles.mobileChevronOpen)}>
                  <svg viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L5.5 5L10 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
              <ul className={cn(styles.mobileCollectionsDropdown, mobileCollectionsOpen && styles.mobileCollectionsDropdownOpen)}>
                <li><Link href="/collections/18k" onClick={() => setMenuOpen(false)}>18K Jewellery</Link></li>
                <li><Link href="/collections/22k" onClick={() => setMenuOpen(false)}>22K Jewellery</Link></li>
              </ul>
            </li>
            <li><Link href="/clientele" onClick={() => setMenuOpen(false)}>Our Clientele</Link></li>
            <li><Link href="/partner" onClick={() => setMenuOpen(false)}>Become a Partner</Link></li>
            <li><Link href="/careers" onClick={() => setMenuOpen(false)}>Careers</Link></li>
            <li><Link href="/contact" onClick={() => setMenuOpen(false)}>Contact</Link></li>
          </ul>          
        </div>
      </header>
    </>
  );
}
