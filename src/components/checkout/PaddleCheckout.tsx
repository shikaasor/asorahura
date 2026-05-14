"use client";

import { useEffect, useState, useRef } from "react";

declare global {
  interface Window {
    Paddle?: {
      Initialize: (config: Record<string, unknown>) => void;
      Checkout: {
        open: (config: Record<string, unknown>) => void;
      };
    };
  }
}

interface Props {
  priceId: string;
  onSuccess?: () => void;
}

export function PaddleCheckout({ priceId, onSuccess }: Props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    script.async = true;

    script.onload = () => {
      if (!window.Paddle) {
        setError("Payment system failed to load. Please refresh the page.");
        return;
      }

      try {
        window.Paddle.Initialize({
          token: process.env.NEXT_PUBLIC_PADDLE_TOKEN!,
          eventCallback: (event: { name: string }) => {
            if (event.name === "checkout.loaded") {
              setIsLoaded(true);
            }
            if (event.name === "checkout.completed") {
              if (onSuccess) {
                onSuccess();
              } else {
                window.location.href = "/checkout/success";
              }
            }
          },
        });

        window.Paddle.Checkout.open({
          items: [{ priceId, quantity: 1 }],
          settings: {
            displayMode: "inline",
            frameTarget: "paddle-checkout-container",
            frameInitialHeight: "500px",
            frameStyle:
              "width: 100%; min-width: 312px; background-color: transparent; border: none;",
          },
        });
      } catch (err) {
        setError("Failed to initialize payment system. Please refresh and try again.");
        console.error("Paddle init error:", err);
      }
    };

    script.onerror = () => {
      setError("Could not load payment system. Please check your connection and try again.");
    };

    document.head.appendChild(script);

    return () => {
      try {
        document.head.removeChild(script);
      } catch {
        // Script may have already been removed
      }
    };
  }, [priceId, onSuccess]);

  if (error) {
    return (
      <div className="p-4 border border-red-200 rounded-lg bg-red-50 text-red-700 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="relative">
      {!isLoaded && (
        <div className="h-96 bg-gray-100 rounded-xl animate-pulse flex items-center justify-center">
          <p className="text-gray-400 text-sm">Loading payment form...</p>
        </div>
      )}
      <div
        id="paddle-checkout-container"
        className={isLoaded ? "block" : "hidden"}
      />
      <p className="text-xs text-gray-400 mt-3 text-center">
        This is a test transaction. No charges will be applied.
      </p>
    </div>
  );
}
