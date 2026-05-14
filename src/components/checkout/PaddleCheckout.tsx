"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./PaddleCheckout.module.css";

declare global {
  interface Window {
    Paddle?: {
      Initialize: (config: Record<string, unknown>) => void;
      Checkout: { open: (config: Record<string, unknown>) => void };
    };
  }
}

interface Props {
  priceId: string;
  onSuccess?: () => void;
}

export function PaddleCheckout({ priceId, onSuccess }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const opened = useRef(false);

  useEffect(() => {
    if (opened.current || !containerRef.current) return;
    opened.current = true;

    function openCheckout() {
      if (!window.Paddle || !containerRef.current) return;

      window.Paddle.Initialize({
        token: process.env.NEXT_PUBLIC_PADDLE_TOKEN!,
        eventCallback: (event: { name: string }) => {
          if (event.name === "checkout.loaded") setIsLoaded(true);
          if (event.name === "checkout.completed") {
            onSuccess ? onSuccess() : (window.location.href = "/checkout/success");
          }
        },
      });

      window.Paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        settings: {
          displayMode: "inline",
          frameTarget: "paddle-checkout-frame",
          frameInitialHeight: "450",
          frameStyle: "width:100%;min-width:312px;background:transparent;border:none;",
        },
      });
    }

    // If Paddle already loaded (e.g. navigating back), open immediately
    if (window.Paddle) {
      openCheckout();
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
  }, [priceId, onSuccess]);

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.wrap}>
      {!isLoaded && (
        <div className={styles.skeleton}>
          <p className={styles.skeletonText}>Loading payment form…</p>
        </div>
      )}
      {/* frameTarget must match this class name exactly */}
      <div
        ref={containerRef}
        className="paddle-checkout-frame"
        style={{ display: isLoaded ? "block" : "none" }}
      />
      <p className={styles.testNote}>
        Test mode — no charges will be applied.
      </p>
    </div>
  );
}
