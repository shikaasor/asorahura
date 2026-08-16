import Link from 'next/link';

interface BlogCTABlockProps {
  type: 'case-study' | 'educational';
}

export default function BlogCTABlock({ type }: BlogCTABlockProps) {
  const isCaseStudy = type === 'case-study';
  return (
    <div style={{
      backgroundColor: 'var(--surface-3)',
      border: '1px solid var(--border-1)',
      borderRadius: 'var(--radius-4)',
      padding: '2.5rem',
      marginTop: '4rem',
      textAlign: 'center',
    }}>
      <p style={{ color: 'var(--accent-ink)', fontSize: '0.875rem', letterSpacing: 'var(--tracking-label)', marginBottom: '0.75rem' }}>
        {isCaseStudy ? '{ Ready to build? }' : '{ Find out where you stand }'}
      </p>
      <h3 style={{ color: 'var(--cream)', fontSize: '1.8125rem', fontWeight: 500, letterSpacing: '-0.032em', marginBottom: '1rem' }}>
        {isCaseStudy
          ? 'See how I can do this for your business.'
          : 'Start Your Free AI Opportunity Discovery.'}
      </h3>
      <p style={{ color: 'var(--ink-2)', fontSize: '1.0625rem', fontWeight: 300, lineHeight: 1.62, maxWidth: '48ch', margin: '0 auto 2rem' }}>
        {isCaseStudy
          ? 'The same architecture principles apply to your operations. Let\'s talk about what AI can automate for you.'
          : 'Find out where AI can save you the most time and get a personalised report in under 5 minutes.'}
      </p>
      {/* The shared pill from globals.css — same control as every other
          primary action on the site, rather than a one-off white button. */}
      <Link href={isCaseStudy ? '/engage' : '/assessment'} className="btn">
        {isCaseStudy ? 'Work With Me' : 'Start the Discovery →'}
      </Link>
    </div>
  );
}
