import mongoose from "mongoose";

/** French is required; English is optional so a project can ship before translation. */
const localizedSchema = (maxlength: number) =>
  new mongoose.Schema(
    {
      fr: { type: String, required: true, trim: true, maxlength },
      en: { type: String, trim: true, default: "", maxlength },
    },
    { _id: false }
  );

const projectSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },

    title: { type: localizedSchema(140), required: true },
    summary: { type: localizedSchema(300), required: true },
    description: { type: localizedSchema(10000), required: true },

    coverImage: { type: String, default: null },
    gallery: { type: [String], default: [] },
    technologies: { type: [String], default: [], index: true },

    role: { type: String, trim: true, default: "" },
    client: { type: String, trim: true, default: "" },
    year: { type: Number, default: null },

    url: { type: String, trim: true, default: "" },
    repoUrl: { type: String, trim: true, default: "" },

    featured: { type: Boolean, default: false },
    /** Manual ordering for the grid; lower sorts first. */
    order: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "published"], default: "draft", index: true },
  },
  { timestamps: true }
);

// Backs the public list query: published projects in display order.
projectSchema.index({ status: 1, order: 1, createdAt: -1 });

export default mongoose.models.Project ?? mongoose.model("Project", projectSchema);
