import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import ParticleWave from "@/components/ParticleWave";
import Footer from "@/components/home/Footer";
import RouteChrome from "@/components/RouteChrome";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
};

export const metadata: Metadata = {
    metadataBase: new URL("https://asorahura.vercel.app"),
    title: "Asor Ahura | AI Automation Authority",
    description: "Transforming Work into Flow. AI-powered automation systems that eliminate operational drag.",
    openGraph: {
        title: "Asor Ahura | AI Automation Authority",
        description: "Transforming Work into Flow. AI-powered automation systems that eliminate operational drag.",
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
            <body className={inter.variable}>
                <RouteChrome>
                    <ParticleWave />
                </RouteChrome>
                <Navigation />
                <div className="nav-offset">
                    {children}
                    <RouteChrome>
                        <Footer />
                    </RouteChrome>
                </div>
            </body>
        </html>
    );
}
