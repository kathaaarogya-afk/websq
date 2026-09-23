import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Writers - Meet Our Tech & AI Community",
  description:
    "Discover writers on WebSQ sharing practical tech, AI and web knowledge. Follow your favourite authors and read their latest published guides and stories.",
  openGraph: {
    title: "Writers | WebSQ",
    description:
      "Discover writers on WebSQ sharing practical tech, AI and web knowledge.",
    url: "https://www.websq.com.au/writers",
  },
  alternates: {
    canonical: "/writers",
  },
};

export default function WritersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}