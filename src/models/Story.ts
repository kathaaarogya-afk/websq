import mongoose, { Schema, Document } from "mongoose";

export interface IStory extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  coverImage: string;
  images: string[];
  author: mongoose.Types.ObjectId;
  status: "draft" | "published";
  adminStatus: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  views: number;
  likesCount: number;
  commentsCount: number;
  bookmarksCount: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  approvedAt?: Date;
}

const StorySchema = new Schema<IStory>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    excerpt: {
      type: String,
      default: "",
      maxlength: [500, "Excerpt cannot exceed 500 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Life",
        "Family",
        "Career",
        "Education",
        "Technology",
        "Travel",
        "Health",
        "Inspiration",
      ],
    },
    coverImage: {
      type: String,
      default: "",
    },
    images: [
      {
        type: String,
      },
    ],
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    adminStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: {
      type: String,
      default: "",
    },
    views: {
      type: Number,
      default: 0,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    bookmarksCount: {
      type: Number,
      default: 0,
    },
    publishedAt: {
      type: Date,
    },
    approvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

StorySchema.pre("save", function () {
  if (this.isNew) {
    const baseSlug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    this.slug = `${baseSlug}-${Date.now()}`;
  }
});

export default mongoose.models.Story ||
  mongoose.model<IStory>("Story", StorySchema);
