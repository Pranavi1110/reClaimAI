const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    organization: String,
    specialization: String,
    location: String
}, { strict: "throw" });

const Partner = mongoose.model('partner', partnerSchema);
module.exports = Partner;
