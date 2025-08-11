const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    venue_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue', required: true, index: true },
    user_id:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    rating:   { type: Number, min: 1, max: 5, required: true },
    comment:  { type: String, default: '' }
  },
  { timestamps:true }
);

// one review per user per venue
ReviewSchema.index({ venue_id: 1, user_id: 1 }, { unique: true });

module.exports = mongoose.model('Review', ReviewSchema);
