import mongoose, { Schema, Document } from "mongoose";

export interface IReaction extends Document {
  user: mongoose.Types.ObjectId;
  story: mongoose.Types.ObjectId;
  type: "inspiring" | "helpful" | "love" | "wow";
  createdAt: Date;
}

const ReactionSchema = new Schema<IReaction>(
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
    type: {
      type: String,
      enum: ["inspiring", "helpful", "love", "wow"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

ReactionSchema.index({ user: 1, story: 1 }, { unique: true });

export default mongoose.models.Reaction ||
  mongoose.model<IReaction>("Reaction", ReactionSchema);
