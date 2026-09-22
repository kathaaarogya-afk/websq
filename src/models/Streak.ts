import mongoose, { Schema, Document } from "mongoose";

export interface IStreak extends Document {
  user: mongoose.Types.ObjectId;
  lastPublishedDate: Date;
  currentStreak: number;
  longestStreak: number;
  totalStories: number;
  badges: string[];
  updatedAt: Date;
}

const StreakSchema = new Schema<IStreak>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    lastPublishedDate: {
      type: Date,
      default: null,
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    totalStories: {
      type: Number,
      default: 0,
    },
    badges: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Streak ||
  mongoose.model<IStreak>("Streak", StreakSchema);
