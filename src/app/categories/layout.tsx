import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories - Explore Story Topics",
  description:
    "Discover stories by category: Life, Family, Career, Education, Technology, Travel, Health, and Inspiration. Find stories that matter to you.",
  openGraph: {
    title: "Categories | WebSQ",
    description:
      "Discover stories by category: Life, Family, Career, Education, Technology, Travel, Health, and Inspiration.",
    url: "https://www.websq.com.au/categories",
  },
  alternates: {
    canonical: "/categories",
  },
};

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
