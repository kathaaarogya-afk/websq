import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Story from "@/models/Story";
import StoryViewer from "./StoryViewer";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const SITE_URL = "https://www.websq.com.au";

function stripMarkdown(text: string): string {
  return text
    .replace(/[#>*_`~[\]()!-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function getPublishedStory(slug: string) {
  try {
    await connectDB();
    const isObjectId =
      slug.length === 24 && /^[a-fA-F0-9]{24}$/.test(slug);

    const query = isObjectId
      ? { $or: [{ slug }, { _id: slug }], status: "published" }
      : { slug, status: "published" };

    return await Story.findOne(query)
      .populate("author", "name image bio followersCount")
      .lean();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = await getPublishedStory(slug);

  if (!story) {
    return {
      title: "Story Not Found | WebSQ",
      robots: { index: false, follow: false },
    };
  }

  const description = stripMarkdown(
    story.excerpt || story.content.slice(0, 220)
  );

  return {
    title: `${story.title} | WebSQ`,
    description,
    alternates: { canonical: `/stories/${story.slug}` },
    openGraph: {
      title: story.title,
      description,
      type: "article",
      url: `${SITE_URL}/stories/${story.slug}`,
      siteName: "WebSQ",
      images: story.coverImage
        ? [{ url: story.coverImage, alt: story.title }]
        : [],
      publishedTime:
        story.publishedAt?.toISOString?.() ||
        story.createdAt?.toISOString?.(),
      authors: [story.author?.name],
    },
    twitter: {
      card: "summary_large_image",
      title: story.title,
      description,
      images: story.coverImage ? [story.coverImage] : [],
    },
  };
}

export default async function StoryPage({ params }: PageProps) {
  const { slug } = await params;
  const story = await getPublishedStory(slug);

  if (story) {
    const description = stripMarkdown(
      story.excerpt || story.content.slice(0, 220)
    );
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: story.title,
      description,
      image: [story.coverImage, ...(story.images || [])].filter(Boolean),
      datePublished:
        story.publishedAt?.toISOString?.() ||
        story.createdAt?.toISOString?.(),
      dateModified: story.updatedAt?.toISOString?.(),
      author: {
        "@type": "Person",
        name: story.author?.name || "WebSQ",
        url: `${SITE_URL}/profile/${story.author?._id}`,
      },
      publisher: {
        "@type": "Organization",
        name: "WebSQ",
        url: SITE_URL,
      },
      mainEntityOfPage: `${SITE_URL}/stories/${story.slug}`,
    };

    const breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: story.category,
          item: `${SITE_URL}/stories`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: story.title,
          item: `${SITE_URL}/stories/${story.slug}`,
        },
      ],
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />
        <StoryViewer slug={slug} initialStory={story} />
      </>
    );
  }

  notFound();
}