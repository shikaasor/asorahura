import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import ParticleWave from "@/components/ParticleWave";
import OrbField from "@/components/OrbField";
import Footer from "@/components/home/Footer";
import MeshTerrain from "@/components/home/MeshTerrain";
import RouteChrome from "@/components/RouteChrome";
import NavOffset from "@/components/NavOffset";

// One family for the whole site. Outfit's geometric skeleton carries the
// look on its own, so the serif and mono slots are gone rather than
// aliased — every stylesheet now asks for --font-sans directly.
const outfit = Outfit({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-sans",
});

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
};

export const metadata: Metadata = {
    metadataBase: new URL("https://asorahura.com"),
    title: "Asor Ahura | Automations that work like your best hire",
    description: "Automations that work like your best hire: reliable, consistent, and yours to keep.",
    openGraph: {
        title: "Asor Ahura | Automations that work like your best hire",
        description: "Automations that work like your best hire: reliable, consistent, and yours to keep.",
        images: [
            {
                url: "/banner1.png",
                width: 1000,
                height: 400,
                alt: "Asor Ahura Banner",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        images: ["/banner1.png"],
    },
    icons: {
        icon: "/logo.png",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <script
                    defer
                    data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? "asorahura.com"}
                    src="https://plausible.io/js/script.js"
                />
            </head>
            <body className={outfit.variable}>
                <RouteChrome>
                    <ParticleWave />
                    <OrbField />
                </RouteChrome>
                <Navigation />
                <NavOffset>
                    {children}
                    <RouteChrome>
                        <MeshTerrain />
                        <Footer />
                    </RouteChrome>
                </NavOffset>
            </body>
        </html>
    );
}
