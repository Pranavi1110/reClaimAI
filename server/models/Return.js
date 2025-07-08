const mongoose = require("mongoose");

const returnSchema = new mongoose.Schema({
  productName: String,
  imageUrl: String,
  condition: String,
  reason: String,
  description: String,
  purchaseDate: { type: Date, required: true },
  status: { type: String, default: "pending" },
  assignedPartner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Return", returnSchema);
