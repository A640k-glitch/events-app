import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "FifthEvents — Enterprise Event & Lead Management Platform",
    template: "%s | FifthEvents",
  },
  description: "Enterprise event discovery, staff attendance manifests, and visitor lead acquisition for FifthLab Nigeria & CWG PLC.",
  icons: {
    icon: [
      { url: "/plogo.jpg", type: "image/jpeg" },
      { url: "/icon.jpg", type: "image/jpeg" },
    ],
    shortcut: "/plogo.jpg",
    apple: [
      { url: "/plogo.jpg", sizes: "180x180", type: "image/jpeg" },
    ],
  },
  openGraph: {
    title: "FifthEvents — Enterprise Event & Lead Management Platform",
    description: "Enterprise event discovery, staff attendance manifests, and visitor lead acquisition for FifthLab Nigeria & CWG PLC.",
    images: [
      {
        url: "/plogo.jpg",
        width: 1200,
        height: 630,
        alt: "FifthEvents Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FifthEvents — Enterprise Event & Lead Management Platform",
    description: "Enterprise event discovery, staff attendance manifests, and visitor lead acquisition for FifthLab Nigeria & CWG PLC.",
    images: ["/plogo.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased bg-[#08090b] text-[#f5f5f7] font-sans font-light selection:bg-blue-600 selection:text-white flex flex-col min-h-screen relative bg-dark-geometric-lines">
        
        {/* Global Abstract Geometric Lines & Blueprint Vectors Backdrop Overlay */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-25">
          <svg className="w-full h-full" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="120" x2="1440" y2="120" stroke="white" strokeWidth="0.5" strokeDasharray="8 8" opacity="0.15" />
            <line x1="0" y1="450" x2="1440" y2="450" stroke="#3b82f6" strokeWidth="0.75" opacity="0.2" />
            <line x1="0" y1="780" x2="1440" y2="780" stroke="white" strokeWidth="0.5" strokeDasharray="8 8" opacity="0.15" />
            
            <line x1="240" y1="0" x2="240" y2="900" stroke="white" strokeWidth="0.5" strokeDasharray="6 6" opacity="0.1" />
            <line x1="720" y1="0" x2="720" y2="900" stroke="#3b82f6" strokeWidth="0.75" opacity="0.15" />
            <line x1="1200" y1="0" x2="1200" y2="900" stroke="white" strokeWidth="0.5" strokeDasharray="6 6" opacity="0.1" />

            <path d="M0 0L1440 900" stroke="#3b82f6" strokeWidth="0.75" opacity="0.1" />
            <path d="M1440 0L0 900" stroke="white" strokeWidth="0.5" strokeDasharray="12 12" opacity="0.08" />

            <circle cx="720" cy="450" r="350" stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="6 6" opacity="0.15" />
            <circle cx="720" cy="450" r="550" stroke="white" strokeWidth="0.5" opacity="0.08" />

            {/* Crosshairs */}
            <circle cx="240" cy="120" r="4" fill="#3b82f6" opacity="0.4" />
            <circle cx="1200" cy="120" r="4" fill="#3b82f6" opacity="0.4" />
            <circle cx="240" cy="780" r="4" fill="#3b82f6" opacity="0.4" />
            <circle cx="1200" cy="780" r="4" fill="#3b82f6" opacity="0.4" />
          </svg>
        </div>

        <AppProvider>
          <Navbar />
          <main className="flex-1 pt-16 md:pt-20 relative z-10">
            {children}
          </main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
