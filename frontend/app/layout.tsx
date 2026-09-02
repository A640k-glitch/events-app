import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import LayoutShell from "@/components/layout/LayoutShell";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://fifthevents.vercel.app"),
  title: {
    default: "FifthEvents — Enterprise Event & Lead Management Platform",
    template: "%s | FifthEvents",
  },
  description: "Enterprise event discovery, staff attendance manifests, and visitor lead acquisition for The FifthLab Nigeria & CWG PLC.",
  icons: {
    icon: [
      { url: "/brand/fifthevents-emblem.svg", type: "image/svg+xml" },
      { url: "/icon.jpg", type: "image/jpeg" },
    ],
    shortcut: "/brand/fifthevents-emblem.svg",
    apple: [
      { url: "/brand/fifthevents-emblem.svg", sizes: "180x180", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://fifthevents.vercel.app",
    siteName: "FifthEvents",
    title: "FifthEvents — Enterprise Event & Lead Management Platform",
    description: "Enterprise event discovery, staff attendance manifests, and visitor lead acquisition for The FifthLab & CWG PLC ecosystems.",
    images: [
      {
        url: "/brand/fifthevents_card_hero.jpg",
        width: 1200,
        height: 630,
        alt: "FifthEvents — A FifthLab Product",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FifthEvents — Enterprise Event & Lead Management Platform",
    description: "Enterprise event discovery, staff attendance manifests, and visitor lead acquisition for The FifthLab & CWG PLC.",
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

