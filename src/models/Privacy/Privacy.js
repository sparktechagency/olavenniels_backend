const mongoose = require("mongoose");

const privacySchema = new mongoose.Schema({

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

const Privacy = mongoose.model("Privacy", privacySchema);

module.exports = Privacy;
