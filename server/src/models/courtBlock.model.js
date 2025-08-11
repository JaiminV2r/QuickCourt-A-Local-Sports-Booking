const mongoose = require('mongoose');

const CourtBlockSchema = new mongoose.Schema(
  {
    court_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Court', required: true, index: true },
    start_at: { type: Date, required: true, index: true },
    end_at: { type: Date, required: true, index: true },
    reason: { type: String, default: 'maintenance' },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  {  timestamps:true }
);

CourtBlockSchema.index({ court_id: 1, start_at: 1, end_at: 1 });

module.exports = mongoose.model('CourtBlock', CourtBlockSchema);
