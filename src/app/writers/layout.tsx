import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Writers - Meet Our Storytelling Community",
  description:
    "Discover talented writers on WebSQ. Follow your favourite storytellers and read their latest published stories.",
  openGraph: {
    title: "Writers | WebSQ",
    description:
      "Discover talented writers on WebSQ. Follow your favourite storytellers.",
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
