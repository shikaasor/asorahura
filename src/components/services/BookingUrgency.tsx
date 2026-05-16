import { BOOKING_SLOTS } from '@/config/booking';
import styles from './BookingUrgency.module.css';

export function BookingUrgency() {
  if (BOOKING_SLOTS <= 0) return null;
  const month = new Date().toLocaleString('en-US', { month: 'long' });
  return (
    <p className={styles.urgency}>
      Currently booking for {month} — {BOOKING_SLOTS} slot{BOOKING_SLOTS !== 1 ? 's' : ''} remaining
    </p>
  );
}
