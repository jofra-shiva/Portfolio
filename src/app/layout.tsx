import { Providers } from "./providers";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const BASE_URL = "https://sivaprakashm.vercel.app";

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: "Sivaprakash M | Full Stack Developer",
  description: "Sivaprakash M — Full Stack Web Developer specializing in Next.js and React. Available for internships, freelance, and software developer roles.",
  keywords: "Sivaprakash, Full Stack Developer, Next.js, React, Node.js, Web Developer, Tamil Nadu, Portfolio",
  authors: [{ name: "Sivaprakash M" }],
  alternates: {
    canonical: BASE_URL + "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Sivaprakash M | Full Stack Developer",
    description: "Building scalable, responsive web applications with modern tech. Available for internships and freelance work.",
    url: BASE_URL + "/",
    siteName: "Sivaprakash M — Portfolio",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Sivaprakash M — Full Stack Developer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sivaprakash M | Full Stack Developer",
    description: "Full Stack developer building scalable web applications.",
    creator: "@sivaprakashm",
    images: ["/api/og"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem('theme');
                  var prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
                  if (savedTheme === 'light' || (!savedTheme && prefersLight)) {
                    document.documentElement.setAttribute('data-theme', 'light');
                  }
                  var savedColorTheme = localStorage.getItem('color-theme');
                  if (savedColorTheme) {
                    document.documentElement.setAttribute('data-color-theme', savedColorTheme);
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
