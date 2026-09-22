import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Report Content - Help Keep WebSQ Safe",
  description:
    "Report inappropriate content, spam, or policy violations on WebSQ. Help us maintain a safe and welcoming storytelling community.",
  openGraph: {
    title: "Report Content | WebSQ",
    description: "Help us maintain a safe and welcoming storytelling community.",
  },
  alternates: {
    canonical: "/report-content",
  },
};

export default function ReportContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
