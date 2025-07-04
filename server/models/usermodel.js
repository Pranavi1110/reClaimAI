const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['user', 'admin', 'partner'],
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    profileImg: String,
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { strict: "throw" });

const User = mongoose.model("user", userSchema);
module.exports = User;
