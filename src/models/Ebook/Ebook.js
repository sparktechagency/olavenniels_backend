const mongoose = require("mongoose");

const ebookSchema = new mongoose.Schema(
  {
    bookCover: {
      type: String, // URL or path of the image (can be stored in S3, local storage, etc.)
      required: true,
    },
    bookName: {
      type: String,
      required: true,
      trim: true,
    },
    synopsis: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String, // You can also use an enum or create a separate category model
      required: true,
      trim: true,
    },
    pdfFile: {
      type: String, // URL/path to the uploaded PDF file
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
      min: 1,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId, // Reference to admin user who created it
      ref: "Admin",
    },
  },
  { timestamps: true }
);

const Ebook = mongoose.model("Ebook", ebookSchema);

module.exports = Ebook;