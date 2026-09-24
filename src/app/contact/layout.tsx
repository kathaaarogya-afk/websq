import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the WebSQ team. Send us your questions, feedback or partnership ideas — we'd love to hear from you.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact WebSQ",
    description:
      "Reach out to the WebSQ team with questions, feedback and partnership ideas.",
    url: "https://www.websq.com.au/contact",
    siteName: "WebSQ",
    type: "website",
  },
};

export default function ContactLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}