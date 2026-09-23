import type { Metadata } from "next";
import "./globals.css";

import Header from "@/components/header";
import Footer from "@/components/footer";
import BackToTop from "@/components/BackToTop";
import ReadingProgress from "@/components/ReadingProgress";
import NewsletterPopup from "@/components/NewsletterPopup";
import Providers from "@/components/Providers";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: {
    default: "WebSQ - Learn, Build & Share Tech, AI, SEO & Marketing Guides",
    template: "%s | WebSQ",
  },
  description:
    "WebSQ is an Australian community for learning, building and sharing knowledge about website technology, artificial intelligence, SEO and digital marketing. Read practical guides, write tutorials, and grow with a community of builders and learners.",
  keywords: [
    "technology blog",
    "AI guides",
    "artificial intelligence explained",
    "web development",
    "SEO tips",
    "search engine optimisation",
    "digital marketing",
    "online marketing",
    "website technology",
    "tech tutorials",
    "AI tools",
    "web design",
    "blogging community",
    "learn tech",
    "Australian community",
    "tech writers",
    "web blog",
    "marketing blog",
  ],
  authors: [{ name: "WebSQ" }],
  creator: "WebSQ",
  publisher: "WebSQ",
  metadataBase: new URL("https://www.websq.com.au"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: "https://www.websq.com.au",
    siteName: "WebSQ",
    title: "WebSQ - Learn, Build & Share Tech, AI, SEO & Marketing",
    description:
      "Practical guides on website technology, AI, SEO and digital marketing — read, write and share with our community.",
    images: [
      {
        url: "/hero.jpg",
        width: 1200,
        height: 630,
        alt: "WebSQ - Tech, AI, SEO & marketing guides",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WebSQ - Learn, Build & Share Tech, AI, SEO & Marketing",
    description:
      "Practical guides on website technology, AI, SEO and digital marketing — read, write and share with our community.",
    images: ["/hero.jpg"],
    creator: "@websq",
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
  verification: {},
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "WebSQ",
  alternateName: "WebSQ - Learn, Build & Share Tech, AI, SEO & Marketing",
  url: "https://www.websq.com.au",
  description:
    "An Australian community for learning, building and sharing knowledge about website technology, artificial intelligence, SEO and digital marketing.",
  publisher: {
    "@type": "Organization",
    name: "WebSQ",
    url: "https://www.websq.com.au",
    logo: {
      "@type": "ImageObject",
      url: "https://www.websq.com.au/logo.svg",
    },
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://www.websq.com.au/stories?search={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "WebSQ",
  url: "https://www.websq.com.au",
  logo: "https://www.websq.com.au/logo.svg",
  description:
    "An Australian community for learning, building and sharing knowledge about website technology, artificial intelligence, SEO and digital marketing.",
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    email: "hello@websq.com.au",
    contactType: "customer service",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <meta name="theme-color" content="#EAB308" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
      </head>
      <body className="antialiased">
        <Providers>
          <ReadingProgress />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#fff",
                color: "#333",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                padding: "12px 16px",
              },
              success: {
                iconTheme: {
                  primary: "#22c55e",
                  secondary: "#fff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fff",
                },
              },
            }}
          />
          <Header />
          {children}
          <Footer />
          <BackToTop />
          <NewsletterPopup />
        </Providers>
      </body>
    </html>
  );
}
