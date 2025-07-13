const mongoose = require('mongoose');

// Schema for repair partner-specific fields
const repairDetailsSchema = new mongoose.Schema({
  organizationName: String,
  address: String,
  contactNumber: String,
  website: String,
  stats: {
    totalItemsHandled: { type: Number, default: 0 },
    itemsRepaired: { type: Number, default: 0 }
  }
}, { _id: false });

// Schema for NGO partner-specific fields
const ngoDetailsSchema = new mongoose.Schema({
  organizationName: String,
  address: String,
  contactNumber: String,
  website: String,
  stats: {
    totalItemsHandled: { type: Number, default: 0 },
    itemsDonated: { type: Number, default: 0 }
  }
}, { _id: false });

// Final user schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['user', 'partner', 'admin'], default: 'user' },
  greenPoints: { type: Number, default: 0 },

  // Applies only if role is 'partner'
  partnerDetails: {
    type: {
      type: String,
      enum: ['repair', 'ngo'],
      required: function () {
        return this.role === 'partner';
      }
    },
    repairInfo: {
      type: repairDetailsSchema,
      required: function () {
        return this.role === 'partner' && this.partnerDetails?.type === 'repair';
      }
    },
    ngoInfo: {
      type: ngoDetailsSchema,
      required: function () {
        return this.role === 'partner' && this.partnerDetails?.type === 'ngo';
      }
    }
  }
});

module.exports = mongoose.model('User', userSchema);