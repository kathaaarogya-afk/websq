import mongoose, { Schema, Document } from "mongoose";

export interface IBookmark extends Document {
  user: mongoose.Types.ObjectId;
  story: mongoose.Types.ObjectId;
  createdAt: Date;
}

const BookmarkSchema = new Schema<IBookmark>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    story: {
      type: Schema.Types.ObjectId,
      ref: "Story",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

BookmarkSchema.index({ user: 1, story: 1 }, { unique: true });

export default mongoose.models.Bookmark ||
  mongoose.model<IBookmark>("Bookmark", BookmarkSchema);
