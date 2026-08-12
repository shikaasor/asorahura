"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

declare global {
  interface Window {
    plausible?: (
      eventName: string,
      options?: { props?: Record<string, string | number> }
    ) => void;
  }
}

export function trackAnalyticsEvent(
  eventName:
    | "Land"
    | "Demo Interaction"
    | "Build Map Submit"
    | "Checkout Opened"
    | "Purchase"
    | "Success Page Submit"
    | "Offering Card Click"
    | "Waitlist CTA Click"
    | "Waitlist Submit",
  props?: Record<string, string | number>
): void {
  if (typeof window !== "undefined" && window.plausible) {
    window.plausible(eventName, { props });
  }
}

export function useTrackLandEvent(): void {
  const searchParams = useSearchParams();

  useEffect(() => {
    trackAnalyticsEvent("Land", {
      utm_source: searchParams.get("utm_source") ?? "direct",
      utm_campaign: searchParams.get("utm_campaign") ?? "organic",
      utm_medium: searchParams.get("utm_medium") ?? "",
      utm_content: searchParams.get("utm_content") ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
