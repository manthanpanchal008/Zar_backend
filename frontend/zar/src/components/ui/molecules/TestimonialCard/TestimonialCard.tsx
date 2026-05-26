import Image from 'next/image';
import styles from './TestimonialCard.module.css';

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  image: string;
}

export default function TestimonialCard({ quote, name, role, image }: TestimonialCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image src={image} alt={name} fill sizes="800px" />
      </div>
      <div className={styles.content}>
        <p className={styles.quote}>&ldquo;{quote}&rdquo;</p>
        <div>
          <p className={styles.author}>{name}</p>
          <p className={styles.role}>{role}</p>
        </div>
      </div>
    </div>
  );
}
