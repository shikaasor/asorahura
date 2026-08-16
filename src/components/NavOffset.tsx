"use client";

import { usePathname } from "next/navigation";

// Applies the "nav-offset" top padding that compensates for the site-wide
// fixed Navigation. Suppressed on /internal routes, which hide Navigation
// (see Navigation.tsx) and would otherwise render a dead gap above their
// own self-contained header. Also suppressed on the homepage, where the
// Hero sits flush under the transparent nav and handles its own clearance.
export default function NavOffset({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const suppressed = pathname.startsWith("/internal") || pathname === "/";

    return <div className={suppressed ? undefined : "nav-offset"}>{children}</div>;
}
