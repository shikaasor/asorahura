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
      background: 'var(--surface-1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{ maxWidth: '480px', textAlign: 'center' }}>
        <p style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--accent-ink)' }}>✓</p>
        <h1 style={{ fontSize: '1.8125rem', fontWeight: 500, letterSpacing: '-0.032em', color: 'var(--cream)', marginBottom: '0.75rem' }}>
          You&apos;re unsubscribed
        </h1>
        <p style={{ color: 'var(--ink-2)', fontWeight: 300, lineHeight: 1.62, marginBottom: '2rem' }}>
          You won&apos;t receive any further emails from Asor Ahura. If this was a mistake, reply to any previous email and we&apos;ll sort it out.
        </p>
        <Link href="/" style={{ color: 'var(--ink-2)', fontSize: '0.875rem', textDecoration: 'underline' }}>
          Back to home
        </Link>
      </div>
    </main>
  );
}
