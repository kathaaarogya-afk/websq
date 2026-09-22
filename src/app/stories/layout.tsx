import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stories - Share & Read Real Life Experiences",
  description:
    "Browse and read inspiring stories from real people around Australia. Discover life experiences, career journeys, family moments, travel adventures, and more.",
  openGraph: {
    title: "Stories | WebSQ",
    description:
      "Browse and read inspiring stories from real people around Australia.",
    url: "https://www.websq.com.au/stories",
  },
  alternates: {
    canonical: "/stories",
  },
};

export default function StoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
