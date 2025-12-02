import mongoose from "mongoose";

const nameFieldSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, lowercase: true },
    secretKey: { type: String, required: true },
    chose: { type: String, default: "" },
  },
  { _id: false }
);

const namesSchema = new mongoose.Schema(
  {
    names: {
      type: [nameFieldSchema],
      default: [],
    },
  },
  { timestamps: true }
);

namesSchema.index({ "names.name": 1 }, { unique: false });

export default mongoose.models.Names || mongoose.model("Names", namesSchema);
