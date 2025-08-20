const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
    {
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
        bookCover: {
            type: String, // image path or URL
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "BookCategory",
            required: true,
        },
        categoryName: {
            type: String,
            required: true,
        },
        tags: {
            type: [String],
            default: [],
        },

        // Ebook version

        pdfFile: { type: String },
        totalPages: { type: Number, min: 1 },


        // AudioBook version

        audioFile: { type: String },
        duration: { type: Number }, // seconds/minutes


        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: true,
        },
    },
    { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
