import Link from 'next/link';

interface BlogCTABlockProps {
  type: 'case-study' | 'educational';
}

export default function BlogCTABlock({ type }: BlogCTABlockProps) {
  const isCaseStudy = type === 'case-study';
  return (
    <div style={{
      backgroundColor: '#0a0a0a',
      border: '1px solid #1f1f1f',
      borderRadius: '12px',
      padding: '2.5rem',
      marginTop: '4rem',
      textAlign: 'center',
    }}>
      <p style={{ color: '#a3a3a3', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
        {isCaseStudy ? 'Ready to build?' : 'Find out where you stand'}
      </p>
      <h3 style={{ color: '#ffffff', fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
        {isCaseStudy
          ? 'See how I can do this for your business.'
          : 'Take the Free AI Readiness Assessment.'}
      </h3>
      <p style={{ color: '#a3a3a3', fontSize: '1rem', marginBottom: '2rem', maxWidth: '480px', margin: '0 auto 2rem' }}>
        {isCaseStudy
          ? 'The same architecture principles apply to your operations. Let\'s talk about what AI can automate for you.'
          : 'Find out your AI readiness score and get a personalised report in under 5 minutes.'}
      </p>
      <Link
        href={isCaseStudy ? '/engage' : '/assessment'}
        style={{
          display: 'inline-block',
          backgroundColor: '#ffffff',
          color: '#0a0a0a',
          padding: '0.875rem 2rem',
          borderRadius: '8px',
          fontWeight: 600,
          fontSize: '0.9375rem',
          textDecoration: 'none',
        }}
      >
        {isCaseStudy ? 'Work With Me' : 'Take the Assessment →'}
      </Link>
    </div>
  );
}
