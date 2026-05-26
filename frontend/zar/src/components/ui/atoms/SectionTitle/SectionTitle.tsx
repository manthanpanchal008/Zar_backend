import styles from './SectionTitle.module.css';
import { cn } from '@/lib/utils';

interface SectionTitleProps {
  heading: string;
  subtitle?: string;
  light?: boolean;
  large?: boolean;
  className?: string;
}

export default function SectionTitle({ heading, subtitle, light = false, large = false, className }: SectionTitleProps) {
  return (
    <div className={cn(styles.sectionTitle, className)}>
      <h2 className={cn(styles.heading, light && styles.headingWhite, large && styles.subtitleLarge)}>
        {heading}
      </h2>
      {subtitle && (
        <p className={cn(styles.subtitle, light && styles.subtitleWhite)}>{subtitle}</p>
      )}
    </div>
  );
}
