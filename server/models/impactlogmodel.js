const mongoose = require("mongoose");

const impactLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    emissionsSaved: {
        type: Number,
        default: 0
    },
    itemsSaved: {
        type: Number,
        default: 0
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, { strict: "throw" });

const ImpactLog = mongoose.model('impact_log', impactLogSchema);
module.exports = ImpactLog;
