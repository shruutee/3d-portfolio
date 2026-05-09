import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "sonner";

import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import "./globals.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://3d-shruti-sharma-portfolio.github.io";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Shruti Sharma - Software Development Engineer",
    template: "%s - Shruti Sharma",
  },
  description:
    "Portfolio of Shruti Sharma, a Computer Science Engineering student building thoughtful, performant web experiences.",
  keywords: [
    "SDE",
    "Software Engineer",
    "Full Stack",
    "React",
    "Next.js",
    "TypeScript",
  ],
  authors: [{ name: "Shruti Sharma" }],
  creator: "Shruti Sharma",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Shruti Sharma - Portfolio",
    title: "Shruti Sharma - Software Development Engineer",
    description: "Building delightful, performant web experiences.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Shruti Sharma" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shruti Sharma - SDE",
    description: "Building delightful, performant web experiences.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: `${SITE_URL}/favicon.ico`,
    apple: `${SITE_URL}/favicon.ico`,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Shruti Sharma",
  url: SITE_URL,
  jobTitle: "Software Development Engineer",
  sameAs: [],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <SmoothScrollProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
            >
              Skip to content
            </a>
            <main id="main">{children}</main>
            <Toaster
              position="bottom-right"
              toastOptions={{
                className: "glass",
                style: { border: "1px solid var(--glass-border)" },
              }}
            />
          </SmoothScrollProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
