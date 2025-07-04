const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: String,
    type: {
        type: String,
        enum: ['reusable', 'refurbished'],
        required: true
    },
    description: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { strict: "throw" });

const Product = mongoose.model('product', productSchema);
module.exports = Product;
