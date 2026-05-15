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
      backgroundColor: '#0a0a0a',
      border: '1px solid #1f1f1f',
      borderRadius: '12px',
      padding: '2.5rem',
    }}>
      <p style={{
        color: '#a3a3a3',
        fontSize: '0.8125rem',
        fontWeight: 600,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        marginBottom: '0.5rem',
      }}>
        Newsletter
      </p>
      <h3 style={{
        color: '#ffffff',
        fontSize: '1.25rem',
        fontWeight: 700,
        marginBottom: '0.5rem',
      }}>
        Get automation insights twice a month.
      </h3>
      <p style={{
        color: '#a3a3a3',
        fontSize: '0.9375rem',
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
                backgroundColor: '#111111',
                border: inputFocused ? '1px solid #333333' : '1px solid #1f1f1f',
                color: '#ffffff',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                fontSize: '0.9375rem',
                flex: 1,
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              style={{
                backgroundColor: '#ffffff',
                color: '#0a0a0a',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontWeight: 600,
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
              color: '#ef4444',
              fontSize: '0.875rem',
              marginTop: '0.5rem',
            }}>
              {errorMsg}
            </p>
          )}
        </form>
      ) : (
        <p style={{
          color: '#a3a3a3',
          fontSize: '0.9375rem',
          marginTop: '1rem',
        }}>
          You&apos;re on the list. Expect insights, not noise.
        </p>
      )}
    </div>
  );
}
