import Image from 'next/image';
import styles from './InstagramCard.module.css';

interface InstagramCardProps {
  image: string;
  alt: string;
}

export default function InstagramCard({ image, alt }: InstagramCardProps) {
  return (
    <div className={styles.card}>
      <Image src={image} alt={alt} fill sizes="(max-width: 768px) 50vw, 25vw" />
    </div>
  );
}
