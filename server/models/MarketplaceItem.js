const mongoose = require('mongoose');

const marketplaceItemSchema = new mongoose.Schema({
  name: String,
  description: String,
  imageUrl: String,
  status: { type: String, enum: ['available', 'claimed', 'sold'], default: 'available' },
  claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  price: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('MarketplaceItem', marketplaceItemSchema); 