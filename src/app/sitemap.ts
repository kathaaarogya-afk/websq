import { MetadataRoute } from "next";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(MONGODB_URI);
}

const StorySchema = new mongoose.Schema({
  slug: String,
  title: String,
  excerpt: String,
  category: String,
  coverImage: String,
  createdAt: Date,
  updatedAt: Date,
});

const CategorySchema = new mongoose.Schema({
  name: String,
  slug: String,
});

const Story = mongoose.models.Story || mongoose.model("Story", StorySchema);
const Category =
  mongoose.models.Category || mongoose.model("Category", CategorySchema);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.websq.com.au";

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/stories`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/categories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/writers`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/daily`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/register`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    { url: `${baseUrl}/community-guidelines`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
  ];

  try {
    await connectDB();

    const stories = await Story.find({ status: "published" })
      .select("slug updatedAt createdAt")
      .lean();

    const storyPages: MetadataRoute.Sitemap = stories.map((story: { slug: string; updatedAt?: Date; createdAt: Date }) => ({
      url: `${baseUrl}/stories/${story.slug}`,
      lastModified: story.updatedAt || story.createdAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

    const categories = await Category.find().select("name").lean();

    const categoryPages: MetadataRoute.Sitemap = categories.map((cat: { name: string }) => ({
      url: `${baseUrl}/stories?category=${cat.name}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    return [...staticPages, ...storyPages, ...categoryPages];
  } catch {
    return staticPages;
  }
}
