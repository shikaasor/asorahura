"use client";

import { usePathname } from "next/navigation";

// Suppresses marketing chrome (e.g. ParticleWave, Footer) on /internal
// routes, mirroring the pathname check Navigation.tsx already uses to hide
// itself there.
export default function RouteChrome({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    if (pathname.startsWith("/internal")) {
        return null;
    }

    return <>{children}</>;
}
