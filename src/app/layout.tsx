import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import ParticleWave from "@/components/ParticleWave";
import Footer from "@/components/home/Footer";
import RouteChrome from "@/components/RouteChrome";
import NavOffset from "@/components/NavOffset";

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
            <body className={inter.variable}>
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
