import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daily Horoscope - Your Zodiac Reading Today",
  description:
    "Read your daily horoscope on WebSQ. Find your zodiac sign and discover what the stars have in store for you today.",
  openGraph: {
    title: "Daily Horoscope | WebSQ",
    description:
      "Read your daily horoscope on WebSQ. Find your zodiac sign and discover what the stars have in store for you.",
    url: "https://www.websq.com.au/daily",
  },
  alternates: {
    canonical: "/daily",
  },
};

export default function DailyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
