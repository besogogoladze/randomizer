import mongoose from "mongoose";

const nameFieldSchema = new mongoose.Schema({
  name: { type: String, default: "", secretKey: String },
  chose: { type: String, default: "" },
});

const namesSchema = new mongoose.Schema(
  {
    names: [nameFieldSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Names || mongoose.model("Names", namesSchema);
