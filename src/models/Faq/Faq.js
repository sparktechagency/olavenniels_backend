const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema({
    question: {
        type: String,
        // required: true,
        trim: true,
    },
    answer: {
        type: String,
        // required: true,
        trim: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
    },
}, {
    timestamps: true
})

const Faq = mongoose.model("Faq", faqSchema);

module.exports = Faq;
