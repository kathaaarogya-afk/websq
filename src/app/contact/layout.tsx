import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Get in Touch with WebSQ",
  description:
    "Have a question, suggestion, or want to collaborate? Contact the WebSQ team. We'd love to hear from you.",
  openGraph: {
    title: "Contact Us | WebSQ",
    description:
      "Have a question, suggestion, or want to collaborate? Contact the WebSQ team.",
    url: "https://www.websq.com.au/contact",
  },
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
