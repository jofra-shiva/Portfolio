import { Providers } from "./providers";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";

// ── Canonical identity ──────────────────────────────────────────────────────
const BASE_URL = "https://www.sivaprakashm.in";
const PERSON_NAME = "Sivaprakash M";
const HEADLINE = "Full Stack Developer • Software Developer • UI/UX Designer • MCA Student";
const DESCRIPTION =
  "Sivaprakash M is a Full Stack Developer and MCA student from Tamil Nadu, India. Specialising in Java, Python, React, Next.js, Node.js, Flutter, and UI/UX Design. Open to software developer roles, internships, and freelance projects.";

// ── Schema.org JSON-LD ──────────────────────────────────────────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${BASE_URL}/#person`,
      name: PERSON_NAME,
      alternateName: ["Sivaprakash", "Sivaprakash Developer", "Sivaprakash Full Stack Developer"],
      url: BASE_URL,
      image: {
        "@type": "ImageObject",
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
      },
      jobTitle: "Full Stack Developer",
      description: DESCRIPTION,
      email: "shivaprakash3115@gmail.com",
      nationality: "Indian",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Theni",
        addressRegion: "Tamil Nadu",
        addressCountry: "IN",
      },
      alumniOf: {
        "@type": "EducationalOrganization",
        name: "MCA Program",
      },
      knowsAbout: [
        "Java", "Python", "JavaScript", "TypeScript", "React", "Next.js",
        "Node.js", "Express.js", "Flutter", "Firebase", "MySQL", "MongoDB",
        "Tailwind CSS", "Bootstrap", "Framer Motion", "REST API", "Git",
        "GitHub", "Figma", "UI/UX Design",
      ],
      sameAs: [
        "https://github.com/jofra-shiva",
        "https://www.linkedin.com/in/sivaprakashm/",
        "https://www.instagram.com/sivaprakash.m_/",
        BASE_URL,
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: `${PERSON_NAME} — Portfolio`,
      description: DESCRIPTION,
      publisher: { "@id": `${BASE_URL}/#person` },
      inLanguage: "en-US",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${BASE_URL}/?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "ProfilePage",
      "@id": `${BASE_URL}/#profile`,
      url: BASE_URL,
      name: `${PERSON_NAME} — Full Stack Developer Portfolio`,
      isPartOf: { "@id": `${BASE_URL}/#website` },
      about: { "@id": `${BASE_URL}/#person` },
      mainEntity: { "@id": `${BASE_URL}/#person` },
      dateModified: new Date().toISOString(),
      inLanguage: "en-US",
    },
  ],
};

// ── Next.js Metadata export ─────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  // ── Titles ────────────────────────────────────────────────────────────────
  title: {
    default: `${PERSON_NAME} | Full Stack Developer & Software Engineer`,
    template: `%s | ${PERSON_NAME}`,
  },
  description: DESCRIPTION,

  // ── Keywords (natural, not stuffed) ──────────────────────────────────────
  keywords: [
    "Sivaprakash M", "Sivaprakash", "Sivaprakash Developer",
    "Sivaprakash Full Stack Developer", "Sivaprakash Portfolio",
    "Sivaprakash Software Developer", "Sivaprakash Java Developer",
    "Sivaprakash React Developer", "Sivaprakash Python Developer",
    "Sivaprakash UI UX Designer", "Sivaprakash MCA",
    "Full Stack Developer Tamil Nadu", "React Developer India",
    "Next.js Developer", "Node.js Developer", "Java Developer",
    "Python Developer", "Flutter Developer", "UI UX Designer",
    "Software Engineer India", "Web Developer Portfolio",
  ],

  // ── Canonical ─────────────────────────────────────────────────────────────
  alternates: {
    canonical: BASE_URL + "/",
  },

  // ── Author / Publisher ───────────────────────────────────────────────────
  authors: [{ name: PERSON_NAME, url: BASE_URL }],
  creator: PERSON_NAME,
  publisher: PERSON_NAME,

  // ── Robots ───────────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ── Open Graph ───────────────────────────────────────────────────────────
  openGraph: {
    title: `${PERSON_NAME} | Full Stack Developer & Software Engineer`,
    description: DESCRIPTION,
    url: BASE_URL + "/",
    siteName: `${PERSON_NAME} — Portfolio`,
    type: "profile",
    locale: "en_US",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: `${PERSON_NAME} — Full Stack Developer Portfolio`,
        type: "image/png",
      },
    ],
  },

  // ── Twitter / X Card ─────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: `${PERSON_NAME} | Full Stack Developer`,
    description: "Full Stack Developer & MCA Student from Tamil Nadu, India. Building scalable web apps with React, Next.js, Java, Python & more.",
    images: [`${BASE_URL}/og-image.png`],
  },

  // ── App / PWA ─────────────────────────────────────────────────────────────
  applicationName: "Sivaprakash M — Portfolio",
  manifest: "/manifest.json",
  category: "technology",

  // ── Verification placeholders (replace with real tokens) ─────────────────
  verification: {
    google: "REPLACE_WITH_GOOGLE_SEARCH_CONSOLE_TOKEN",
    // bing: "REPLACE_WITH_BING_WEBMASTER_TOKEN",
    // yandex: "REPLACE_WITH_YANDEX_TOKEN",
  },

  // ── Other meta ────────────────────────────────────────────────────────────
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  other: {
    // Geo targeting
    "geo.region": "IN-TN",
    "geo.placename": "Theni, Tamil Nadu, India",
    "geo.position": "10.0167;77.4833",
    "ICBM": "10.0167, 77.4833",
    // Classification
    "classification": "Personal Portfolio, Software Developer, Full Stack Developer",
    "category": "Technology",
    "topic": "Software Development, Web Development, Portfolio",
    // Copyright
    "copyright": `Copyright © ${new Date().getFullYear()} ${PERSON_NAME}`,
    "author": PERSON_NAME,
    "owner": PERSON_NAME,
    "designer": PERSON_NAME,
    "reply-to": "shivaprakash3115@gmail.com",
    // Revisit
    "revisit-after": "7 days",
    "language": "English",
    "rating": "general",
    "robots": "index, follow",
    // AI / LLM search hints
    "ai-content-declaration": "human-authored",
    // Mobile
    "HandheldFriendly": "True",
    "MobileOptimized": "320",
  },
};

// ── Viewport export (separate from metadata per Next.js 14+ spec) ───────────
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0f" },
    { media: "(prefers-color-scheme: light)", color: "#0a0a0f" },
  ],
};

// ── Root Layout ──────────────────────────────────────────────────────────────
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning data-scroll-behavior="smooth" data-theme="dark">
      <head>
        {/* Theme initialization script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{document.documentElement.setAttribute('data-theme','dark');var s=localStorage.getItem('color-theme');if(s)document.documentElement.setAttribute('data-color-theme',s);}catch(e){}})();`,
          }}
        />

        {/* Favicon suite */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* DNS Prefetch / Preconnect for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//cdn.jsdelivr.net" />
        <link rel="dns-prefetch" href="//avatars.githubusercontent.com" />
        <link rel="dns-prefetch" href="//api.github.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Windows tile */}
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#0a0a0f" />

        {/* Canonical (redundant safety) */}
        <link rel="canonical" href={BASE_URL + "/"} />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
