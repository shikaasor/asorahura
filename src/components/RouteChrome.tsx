"use client";

import { usePathname } from "next/navigation";

// Suppresses marketing chrome (e.g. ParticleWave, Footer) on /internal and
// /automate routes, mirroring the pathname check Navigation.tsx already uses
// to hide itself there. /automate ships with its own self-contained header
// and footer (see src/app/(automate)/layout.tsx) until Phase 9.
export default function RouteChrome({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    if (pathname.startsWith("/internal") || pathname.startsWith("/automate")) {
        return null;
    }

    return <>{children}</>;
}
