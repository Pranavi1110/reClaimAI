const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  productName: String,
  imageUrl: String,
  condition: String,
  reason: String,
  status: { type: String, default: 'pending' },
  assignedPartner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Return', returnSchema); 