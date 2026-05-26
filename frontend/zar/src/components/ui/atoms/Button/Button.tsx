import type { CSSProperties, ReactNode } from 'react';
import Link from 'next/link';
import styles from './Button.module.css';
import { cn } from '@/lib/utils';

interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  showArrow?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

function AnimatedLabel({ text }: { text: string }) {
  const letters = Array.from(text);

  return (
    <span className={styles.labelWrap} aria-hidden="true">
      <span className={styles.spanMother}>
        {letters.map((char, index) => (
          <span
            key={`top-${index}-${char}`}
            className={styles.char}
            style={{ '--char-index': index } as CSSProperties}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </span>
      <span className={styles.spanMother2}>
        {letters.map((char, index) => (
          <span
            key={`bottom-${index}-${char}`}
            className={styles.char}
            style={{ '--char-index': index } as CSSProperties}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </span>
    </span>
  );
}

function ArrowIcon() {
  return (
    <span className={styles.arrow}>
      <svg viewBox="0 0 19 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12.5 1L18 6M18 6L12.5 11M18 6H1"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export default function Button({
  children,
  href,
  variant = 'primary',
  showArrow = true,
  onClick,
  className,
  type = 'button',
  disabled = false,
}: ButtonProps) {
  const classes = cn(styles.button, styles[variant], className);
  const shouldAnimateLabel = (variant === 'primary' || variant === 'secondary') && typeof children === 'string';

  const label = shouldAnimateLabel ? (
    <>
      <span className={styles.srOnly}>{children}</span>
      <AnimatedLabel text={children} />
    </>
  ) : (
    children
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {label}
        {showArrow && <ArrowIcon />}
      </Link>
    );
  }

  return (
    <button className={classes} onClick={onClick} type={type} disabled={disabled}>
      {label}
      {showArrow && <ArrowIcon />}
    </button>
  );
}
