import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [120, "Title can be at most 120 characters"],
    },
    url: {
      type: String,
      required: [true, "URL is required"],
      trim: true,
      match: [/^https?:\/\/\S+$/i, "URL must start with http:// or https://"],
    },
    tag: {
      type: String,
      trim: true,
      lowercase: true,
      default: "general",
      maxlength: [30, "Tag can be at most 30 characters"],
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // adds createdAt + updatedAt
);

// Faster filtering/sorting for the list endpoint
bookmarkSchema.index({ tag: 1, createdAt: -1 });

export default mongoose.model("Bookmark", bookmarkSchema);
