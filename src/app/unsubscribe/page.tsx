import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Unsubscribed | Asor Ahura',
};

export default function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{ maxWidth: '480px', textAlign: 'center' }}>
        <p style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✓</p>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>
          You&apos;re unsubscribed
        </h1>
        <p style={{ color: '#9ca3af', lineHeight: 1.7, marginBottom: '2rem' }}>
          You won&apos;t receive any further emails from Asor Ahura. If this was a mistake, reply to any previous email and we&apos;ll sort it out.
        </p>
        <Link href="/" style={{ color: '#9ca3af', fontSize: '0.875rem', textDecoration: 'underline' }}>
          Back to home
        </Link>
      </div>
    </main>
  );
}
