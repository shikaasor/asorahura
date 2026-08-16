'use client';

import { useState } from 'react';

export default function EmailCaptureWidget() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [inputFocused, setInputFocused] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus('success');
      } else {
        const data = await res.json();
        setErrorMsg(data.error ?? 'Something went wrong. Try again.');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
      setStatus('error');
    }
  }

  return (
    <div style={{
      backgroundColor: 'var(--surface-3)',
      border: '1px solid var(--border-1)',
      borderRadius: 'var(--radius-4)',
      padding: '2.5rem',
    }}>
      <p style={{
        color: 'var(--accent-ink)',
        fontSize: '0.875rem',
        fontWeight: 400,
        letterSpacing: 'var(--tracking-label)',
        marginBottom: '0.5rem',
      }}>
        { '{ Newsletter }' }
      </p>
      <h3 style={{
        color: 'var(--cream)',
        fontSize: '1.375rem',
        fontWeight: 500,
        letterSpacing: '-0.028em',
        marginBottom: '0.5rem',
      }}>
        Get automation insights twice a month.
      </h3>
      <p style={{
        color: 'var(--ink-2)',
        fontSize: '0.9375rem',
        fontWeight: 300,
        lineHeight: 1.62,
        marginBottom: 0,
      }}>
        No sales pitches. Case studies, architecture decisions, and lessons from production AI systems.
      </p>

      {status !== 'success' ? (
        <form onSubmit={handleSubmit}>
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            marginTop: '1.25rem',
            flexWrap: 'wrap',
          }}>
            <input
              type="email"
              placeholder="your@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              style={{
                backgroundColor: 'var(--surface-1)',
                border: inputFocused ? '1px solid var(--border-3)' : '1px solid var(--border-2)',
                color: 'var(--cream)',
                padding: '0.75rem 1.125rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.9375rem',
                flex: 1,
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              style={{
                backgroundColor: 'var(--accent)',
                color: 'var(--on-accent)',
                padding: '0.75rem 1.75rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 500,
                fontSize: '0.9375rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                border: 'none',
              }}
            >
              {status === 'loading' ? '...' : 'Subscribe'}
            </button>
          </div>
          {status === 'error' && (
            <p style={{
              color: 'var(--error)',
              fontSize: '0.875rem',
              marginTop: '0.5rem',
            }}>
              {errorMsg}
            </p>
          )}
        </form>
      ) : (
        <p style={{
          color: 'var(--accent-ink)',
          fontSize: '0.9375rem',
          marginTop: '1rem',
        }}>
          You&apos;re on the list. Expect insights, not noise.
        </p>
      )}
    </div>
  );
}
