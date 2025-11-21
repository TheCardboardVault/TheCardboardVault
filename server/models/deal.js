const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
    cardName: { type: String, required: true },
    price: { type: Number, required: true },
    condition: { type: String, default: 'Near Mint' },
    source: { type: String, required: true }, // e.g., 'TCGplayer'
    affiliateLink: { type: String, required: true },
    imageUrl: { type: String },
    lastUpdated: { type: Date, default: Date.now }
});

// This index prevents creating duplicate deals for the same card from the same source.
dealSchema.index({ cardName: 1, source: 1 }, { unique: true });

const Deal = mongoose.model('Deal', dealSchema);
module.exports = Deal;