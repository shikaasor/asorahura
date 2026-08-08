"use client";

export default function AutomateError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ padding: "48px 24px", textAlign: "center" }}>
      <p>Something went wrong. Please refresh.</p>
      <button type="button" onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}
