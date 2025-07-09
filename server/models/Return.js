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

  // ✅ ADD THIS LINE to track which user submitted it
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  createdAt: { type: Date, default: Date.now },
});
