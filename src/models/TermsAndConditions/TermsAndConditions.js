const mongoose = require("mongoose");

const termsAndConditionsSchema = new mongoose.Schema({

    description: {
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

const TermsAndConditions = mongoose.model("TermsAndConditions", termsAndConditionsSchema);

module.exports = TermsAndConditions;
