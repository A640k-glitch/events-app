import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import LayoutShell from "@/components/layout/LayoutShell";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://fifthevents.vercel.app"),
  title: {
    default: "fifthEvents - Central hub for all events shaping technology",
    template: "%s | fifthEvents",
  },
  description: "Find technology events across Africa, get entry tickets, and book product demos from FifthLab and CWG.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/brand/fifthevents-emblem.svg", type: "image/svg+xml" },
      { url: "/apple-touch-icon.png", type: "image/png" },
    ],
    shortcut: "/apple-touch-icon.png",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://fifthevents.vercel.app",
    siteName: "fifthEvents",
    title: "fifthEvents - Central hub for all events shaping technology",
    description: "Find technology events across Africa, get entry tickets, and book product demos from FifthLab and CWG.",
    images: [
      {
        url: "/brand/fifthevents_card_hero.jpg",
        width: 1200,
        height: 630,
        alt: "fifthEvents: A FifthLab Product",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "fifthEvents - Central hub for all events shaping technology",
    description: "Find technology events across Africa, get entry tickets, and book product demos from FifthLab and CWG.",
    images: ["/brand/fifthevents_card_hero.jpg"],
    creator: "@TheFifthLab",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans m-0 p-0 overflow-x-hidden selection:bg-[#00B4D8] selection:text-white bg-[#0B0D13]">
        <AppProvider>
          <LayoutShell>
            {children}
          </LayoutShell>
        </AppProvider>
      </body>
    </html>
  );
}
