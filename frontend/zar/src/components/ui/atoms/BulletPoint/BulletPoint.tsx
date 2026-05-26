import styles from './BulletPoint.module.css';

interface BulletPointProps {
  text: string;
}

export default function BulletPoint({ text }: BulletPointProps) {
  return (
    <div className={styles.bulletPoint}>
      <span className={styles.dot} />
      <span className={styles.text}>{text}</span>
    </div>
  );
}
