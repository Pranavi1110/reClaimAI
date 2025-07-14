const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema({
  productName: String,
  imageUrl: String,
  condition: String,
  reason: String,
  description: String,
  purchaseDate: { type: Date, required: true },
  analysisSummary: String,
  status: { type: String, default: "pending" },
  readyForMarket: { type: Boolean, default: false },
  repairStatus: { type: String, default: "Received" },

  assignedPartner: String,
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
  userEmail: { type: String },
  claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  donationOpted: { type: Boolean, default: false },
  ngoRecipient: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Return", returnSchema);
