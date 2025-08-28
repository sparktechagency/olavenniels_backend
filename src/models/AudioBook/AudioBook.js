const mongoose = require('mongoose');

const audioBookSchema = new mongoose.Schema({
    bookCover: {
        type: String, // store the file path or URL
        required: true
    },
    bookName: {
        type: String,
        required: true,
        trim: true
    },
    synopsis: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BookCategory",
        required: true
    },
    categoryName: {
        type: String,
    },
    audioFile: {
        type: String, // store file path or URL
        required: true
    },
    tags: {
        type: [String],
    },
    isSaved: {
        type: Boolean,
        default: false
    },
    isAudioBook: {
        type: Boolean,
        default: true
    },
    isEbook: {
        type: Boolean,
        default: false
    },
    isBook: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('AudioBook', audioBookSchema);
