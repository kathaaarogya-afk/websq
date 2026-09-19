import mongoose, { Schema, Document } from "mongoose";

export interface IReport extends Document {
  reporter: mongoose.Types.ObjectId;
  targetType: "story" | "user" | "image";
  targetId: mongoose.Types.ObjectId;
  reason: string;
  details: string;
  status: "pending" | "reviewed" | "resolved" | "dismissed";
  createdAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    reporter: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetType: {
      type: String,
      enum: ["story", "user", "image"],
      required: true,
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "targetType",
    },
    reason: {
      type: String,
      required: true,
      enum: [
        "Hate speech",
        "Threats or violence",
        "Harassment or bullying",
        "Sexual exploitation",
        "Child exploitation",
        "Non-consensual intimate images",
        "Defamation",
        "Copyright infringement",
        "Spam or scams",
        "Dangerous instructions",
        "Doxxing or personal information",
        "Impersonation",
        "Inappropriate image",
        "Other",
      ],
    },
    details: {
      type: String,
      default: "",
      maxlength: [1000, "Details cannot exceed 1000 characters"],
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved", "dismissed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

ReportSchema.index({ reporter: 1, targetType: 1, targetId: 1 });
ReportSchema.index({ status: 1, createdAt: -1 });

export default mongoose.models.Report ||
  mongoose.model<IReport>("Report", ReportSchema);
