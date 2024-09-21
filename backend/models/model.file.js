import mongoose from "mongoose";
mongoose.pluralize(null);

const fileSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  originalName: String,
  code: Number,
  uploadPath: String,
});

export default mongoose.model("File", fileSchema);
