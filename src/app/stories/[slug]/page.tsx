import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Story from "@/models/Story";
import "@/models/User";
import { pickInternalLinks } from "@/lib/internal-links";
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

function serializeStory(story: {
  _id: unknown;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  coverImage: string;
  images?: string[];
  likesCount: number;
  commentsCount: number;
  views: number;
  author?: {
    _id?: unknown;
    name?: string;
    image?: string;
    bio?: string;
    followersCount?: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}) {
  return {
    _id: String(story._id),
    title: story.title,
    slug: story.slug,
    content: story.content,
    excerpt: story.excerpt,
    category: story.category,
    coverImage: story.coverImage,
    images: (story.images || []).filter(Boolean),
    likesCount: story.likesCount,
    commentsCount: story.commentsCount,
    views: story.views,
    author: {
      _id: story.author
        ? String(story.author._id || (story.author as unknown))
        : "",
      name: story.author?.name || "WebSQ",
      image: story.author?.image || "",
      bio: story.author?.bio || "",
      followersCount: story.author?.followersCount || 0,
    },
    createdAt: story.createdAt?.toISOString?.() || "",
    updatedAt: story.updatedAt?.toISOString?.() || "",
  };
}

async function getRelatedFor(story: {
  title: string;
  slug: string;
  category: string;
}) {
  try {
    await connectDB();
    const candidates = await Story.find({
      status: "published",
      category: story.category,
      slug: { $ne: story.slug },
    })
      .select("_id slug title category excerpt coverImage author")
      .populate("author", "name")
      .limit(8)
      .lean();

    return pickInternalLinks(
      story,
      (candidates as Array<{
        _id: unknown;
        title: string;
        slug: string;
        category: string;
        excerpt?: string;
        coverImage?: string;
        author?: { _id?: unknown; name?: string };
      }>).map((c) => ({
        _id: String(c._id),
        title: c.title,
        slug: c.slug,
        category: c.category,
        excerpt: c.excerpt || "",
        coverImage: c.coverImage,
        author: c.author?.name
          ? { _id: String(c.author._id || ""), name: c.author.name }
          : undefined,
      })),
      3
    );
  } catch {
    return [];
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

    const initialRelated = await getRelatedFor(story);

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
        <StoryViewer
          slug={slug}
          initialStory={serializeStory(story)}
          initialRelated={initialRelated}
        />
      </>
    );
  }

  notFound();
}