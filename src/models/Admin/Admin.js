const mongoose = require("mongoose");


const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        enum: ["ADMIN", "SUPER_ADMIN"],
        default: "ADMIN",
    },
    isVerified: {
        type: Boolean,
        default: true,
    },
} , {
    timestamps: true
})

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
