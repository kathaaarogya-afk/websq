import type { Metadata } from "next";

interface ProfileLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProfileLayoutProps): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `Writer Profile | WebSQ`,
    description:
      "View a writer's stories, bio and followers on the WebSQ community.",
    alternates: {
      canonical: `/profile/${id}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  return <>{children}</>;
}