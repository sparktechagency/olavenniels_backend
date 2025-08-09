const mongoose = require("mongoose");

const bookCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    image: {
        type: String,
        trim: true,
    },
} , {
    timestamps: true
})

const BookCategory = mongoose.model("BookCategory", bookCategorySchema);

module.exports = BookCategory;
