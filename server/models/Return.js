const mongoose = require("mongoose");

const returnSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  productName: String,
  imageUrl: String,
  condition: String,
  reason: String,
  status: { type: String, default: "pending" },
  assignedPartner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  repairStatus: {
    type: String,
    enum: ["Received", "In Progress", "Repaired"],
    default: "Received",
  },
  proofImage: { type: String },
  proofVerified: { type: Boolean, default: null },
  proofReason: { type: String },
  readyForMarket: { type: Boolean, default: false },
});

module.exports = mongoose.model("Return", returnSchema);
