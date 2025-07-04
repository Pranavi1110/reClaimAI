const mongoose = require("mongoose");

const returnSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    condition: {
        type: String,
        required: true
    },
    images: [String], // array of image URLs
    decision: String,
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'in_progress', 'completed'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { strict: "throw" });

const Return = mongoose.model('return', returnSchema);
module.exports = Return;
