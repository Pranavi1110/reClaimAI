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

  assignedPartner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userEmail: { type: String, required: true },

  donationOpted: { type: Boolean, default: false },
  ngoRecipient: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Return", returnSchema);
