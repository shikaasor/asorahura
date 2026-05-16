"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./PaddleCheckout.module.css";

declare global {
  interface Window {
    Paddle?: {
      Environment: { set: (env: string) => void };
      Initialize: (config: Record<string, unknown>) => void;
      Checkout: { open: (config: Record<string, unknown>) => void };
    };
  }
}

// Paddle.Initialize() must only be called once per page load.
let paddleInitialized = false;

// Custom event name used to relay Paddle events through window.
// The eventCallback in Initialize() dispatches here; each mounted component
// instance subscribes independently, so the currently-mounted component always
// receives events regardless of which instance originally called Initialize().
const PADDLE_BUS = "paddle:event";

interface Props {
  priceId: string;
  onSuccess?: () => void;
}

export function PaddleCheckout({ priceId, onSuccess }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  // Subscribe to the global Paddle event bus.
  // Cleaned up on unmount so stale instances never receive events.
  useEffect(() => {
    function handleEvent(e: Event) {
      const { name } = (e as CustomEvent<{ name: string }>).detail;
      if (name === "checkout.loaded") setIsLoaded(true);
      if (name === "checkout.completed") {
        const cb = onSuccessRef.current;
        cb ? cb() : (window.location.href = "/checkout/success");
      }
    }
    window.addEventListener(PADDLE_BUS, handleEvent);
    return () => window.removeEventListener(PADDLE_BUS, handleEvent);
  }, []);

  // Load the Paddle script and open the inline checkout.
  useEffect(() => {
    if (!priceId) {
      setError("No price configured for this tier. Please contact us directly.");
      return;
    }

    function openCheckout() {
      if (!window.Paddle || !containerRef.current) return;

      if (!paddleInitialized) {
        window.Paddle.Environment.set("sandbox");
        window.Paddle.Initialize({
          token: process.env.NEXT_PUBLIC_PADDLE_TOKEN!,
          // Dispatch onto window — decoupled from any specific component instance.
          eventCallback: (event: { name: string }) => {
            window.dispatchEvent(new CustomEvent(PADDLE_BUS, { detail: event }));
          },
        });
        paddleInitialized = true;
      }

      window.Paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        settings: {
          displayMode: "inline",
          frameTarget: "paddle-checkout-frame",
          frameInitialHeight: 450,
          frameStyle: "width:100%;min-width:312px;background:transparent;border:none;",
        },
      });
    }

    if (window.Paddle) {
      openCheckout();
      return;
    }

    const existing = document.querySelector('script[src*="paddle.com/paddle/v2/paddle.js"]');
    if (existing) {
      existing.addEventListener("load", openCheckout, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    script.async = true;
    script.onload = () => {
      if (!window.Paddle) {
        setError("Payment system failed to load. Please refresh the page.");
        return;
      }
      try {
        openCheckout();
      } catch (err) {
        console.error("Paddle init error:", err);
        setError("Failed to initialize payment. Please refresh and try again.");
      }
    };
    script.onerror = () => setError("Could not load payment system. Check your connection.");
    document.head.appendChild(script);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.frameWrap}>
        {!isLoaded && (
          <div className={styles.skeleton}>
            <p className={styles.skeletonText}>Loading payment form…</p>
          </div>
        )}
        {/* frameTarget must match this class name exactly */}
        <div ref={containerRef} className="paddle-checkout-frame" />
      </div>
      <p className={styles.testNote}>Test mode — no charges will be applied.</p>
    </div>
  );
}
