import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  content: string;
  author: mongoose.Types.ObjectId;
  story: mongoose.Types.ObjectId;
  parentComment?: mongoose.Types.ObjectId;
  status: "visible" | "hidden";
  likesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: [true, "Comment content is required"],
      trim: true,
      maxlength: [2000, "Comment cannot exceed 2000 characters"],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    story: {
      type: Schema.Types.ObjectId,
      ref: "Story",
      required: true,
    },
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    status: {
      type: String,
      enum: ["visible", "hidden"],
      default: "visible",
    },
    likesCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

CommentSchema.index({ story: 1, createdAt: -1 });
CommentSchema.index({ author: 1 });

export default mongoose.models.Comment ||
  mongoose.model<IComment>("Comment", CommentSchema);
