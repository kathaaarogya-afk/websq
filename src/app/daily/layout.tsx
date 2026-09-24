import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daily Horoscope - Free Daily Horoscopes for All Zodiac Signs",
  description:
    "Read your free daily horoscope for all 12 zodiac signs — Aries to Pisces. Check what the stars have in store for your love, career and luck today.",
  alternates: {
    canonical: "/daily",
  },
  openGraph: {
    title: "Daily Horoscope | WebSQ",
    description:
      "Free daily horoscopes for all zodiac signs — love, career and luck for today.",
    url: "https://www.websq.com.au/daily",
    siteName: "WebSQ",
    type: "website",
  },
};

export default function DailyLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}