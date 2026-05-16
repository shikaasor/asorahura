import Image from 'next/image';
import styles from './TestimonialCard.module.css';

interface TestimonialCardProps {
  quote: string;
  name: string;
  title: string;
  headshot: string; // local path e.g. "/images/testimonials/placeholder.jpg"
}

export function TestimonialCard({ quote, name, title, headshot }: TestimonialCardProps) {
  return (
    <div className={styles.card}>
      <Image
        src={headshot}
        alt={name}
        width={48}
        height={48}
        className={styles.headshot}
      />
      <p className={styles.quote}>&ldquo;{quote}&rdquo;</p>
      <div className={styles.attribution}>
        <span className={styles.name}>{name}</span>
        <span className={styles.separator}> · </span>
        <span className={styles.title}>{title}</span>
      </div>
    </div>
  );
}
