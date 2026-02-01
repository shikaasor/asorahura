import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
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
            <body className={`${inter.variable} ${playfair.variable}`}>
                <Navigation />
                {children}
            </body>
        </html>
    );
}
