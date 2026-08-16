'use client';

interface CategoryFilterProps {
  categories: string[];
  active: string;
  onChange: (category: string) => void;
}

export default function CategoryFilter({ categories, active, onChange }: CategoryFilterProps) {
  const all = ['All', ...categories];
  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
      {all.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          style={{
            padding: '0.4375rem 1.125rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid',
            // Selection reads as a lit pill, not an inverted one — white
            // fill would put a second bright surface next to the article
            // cards and pull focus off them.
            borderColor: active === cat ? 'var(--border-3)' : 'var(--border-1)',
            backgroundColor: active === cat ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.02)',
            color: active === cat ? 'var(--cream)' : 'var(--ink-2)',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.22,0.61,0.36,1)',
          }}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
