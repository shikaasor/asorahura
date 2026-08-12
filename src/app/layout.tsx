import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import ParticleWave from "@/components/ParticleWave";
import Footer from "@/components/home/Footer";
import RouteChrome from "@/components/RouteChrome";
import NavOffset from "@/components/NavOffset";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const instrumentSerif = Instrument_Serif({
    subsets: ["latin"],
    weight: "400",
    style: ["normal", "italic"],
    variable: "--font-serif",
});
const ibmPlexMono = IBM_Plex_Mono({
    subsets: ["latin"],
    weight: ["400", "500"],
    variable: "--font-mono",
});

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
};

export const metadata: Metadata = {
    metadataBase: new URL("https://asorahura.com"),
    title: "Asor Ahura | Automations that work like your best hire",
    description: "Automations that work like your best hire — reliable, consistent, and yours to keep.",
    openGraph: {
        title: "Asor Ahura | Automations that work like your best hire",
        description: "Automations that work like your best hire — reliable, consistent, and yours to keep.",
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
            <body className={`${inter.variable} ${instrumentSerif.variable} ${ibmPlexMono.variable}`}>
                <RouteChrome>
                    <ParticleWave />
                </RouteChrome>
                <Navigation />
                <NavOffset>
                    {children}
                    <RouteChrome>
                        <Footer />
                    </RouteChrome>
                </NavOffset>
            </body>
        </html>
    );
}
