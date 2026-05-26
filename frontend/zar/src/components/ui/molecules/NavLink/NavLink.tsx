import Link from 'next/link';
import styles from './NavLink.module.css';
import { cn } from '@/lib/utils';

interface NavLinkProps {
  label: string;
  href: string;
  hasDropdown?: boolean;
  active?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export default function NavLink({ label, href, hasDropdown, active, onMouseEnter, onMouseLeave }: NavLinkProps) {
  const handleMouseEnter = () => {
    console.log('NavLink onMouseEnter', label);
    if (onMouseEnter) onMouseEnter();
  };
  const handleMouseLeave = () => {
    console.log('NavLink onMouseLeave', label);
    if (onMouseLeave) onMouseLeave();
  };
  return (
    <div
      className={styles.wrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={href} className={cn(styles.navLink, active && styles.active)}>
        {label}
        {hasDropdown && (
          <span className={styles.chevron}>
            <svg viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L5.5 5L10 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        )}
      </Link>
    </div>
  );
}
