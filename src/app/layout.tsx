import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SessionProvider from "@/components/SessionProvider";
import { NotificationProvider } from "@/contexts/NotificationContext";
import PerformanceMonitor from "@/components/PerformanceMonitor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CarShare - Find Your Perfect Ride",
  description: "Rent cars from trusted hosts or list your car to earn money. Safe, reliable, and affordable car rental platform.",
  keywords: ["car rental", "car sharing", "rent a car", "car hire", "peer to peer car rental", "car rental app"],
  authors: [{ name: "CarShare Team" }],
  creator: "CarShare",
  publisher: "CarShare",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://carshare.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "CarShare - Find Your Perfect Ride",
    description: "Rent cars from trusted hosts or list your car to earn money. Safe, reliable, and affordable car rental platform.",
    url: 'https://carshare.app',
    siteName: 'CarShare',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'CarShare - Car Rental Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "CarShare - Find Your Perfect Ride",
    description: "Rent cars from trusted hosts or list your car to earn money. Safe, reliable, and affordable car rental platform.",
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <NotificationProvider>
            <Navigation />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
            <PerformanceMonitor />
          </NotificationProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
