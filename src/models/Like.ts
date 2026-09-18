import mongoose, { Schema, Document } from "mongoose";

export interface ILike extends Document {
  user: mongoose.Types.ObjectId;
  story: mongoose.Types.ObjectId;
  createdAt: Date;
}

const LikeSchema = new Schema<ILike>(
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

LikeSchema.index({ user: 1, story: 1 }, { unique: true });

export default mongoose.models.Like ||
  mongoose.model<ILike>("Like", LikeSchema);
