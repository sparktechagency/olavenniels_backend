const mongoose = require("mongoose");
 
const bannerSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
    },
}, {
    timestamps: true
})

const Banner = mongoose.model("Banner", bannerSchema);

module.exports = Banner;
