"use client";

import { useTrackLandEvent } from "@/lib/analytics";

export function LandEventTracker() {
  useTrackLandEvent();
  return null;
}
