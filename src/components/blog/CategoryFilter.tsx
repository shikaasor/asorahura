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
            padding: '0.375rem 1rem',
            borderRadius: '9999px',
            border: '1px solid',
            borderColor: active === cat ? '#ffffff' : '#2a2a2a',
            backgroundColor: active === cat ? '#ffffff' : 'transparent',
            color: active === cat ? '#0a0a0a' : '#a3a3a3',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
