const mongoose = require("mongoose");

const donationHistorySchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Return" },
  itemName: String,
  ngoId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  ngoName: String,
  date: { type: Date, default: Date.now },
  status: String,
  credits: Number,
  proofImage: String,
});

module.exports = mongoose.model("DonationHistory", donationHistorySchema);
