const mongoose = require('mongoose');

const DayHoursSchema = new mongoose.Schema(
  { open: { type: String }, close: { type: String } },
  { _id: false }
);

const OperatingHoursSchema = new mongoose.Schema(
  {
    mon: { type: DayHoursSchema },
    tue: { type: DayHoursSchema },
    wed: { type: DayHoursSchema },
    thu: { type: DayHoursSchema },
    fri: { type: DayHoursSchema },
    sat: { type: DayHoursSchema },
    sun: { type: DayHoursSchema }
  },
  { _id: false }
);

const CourtSchema = new mongoose.Schema(
  {
    venue_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue', required: true, index: true },
    name: { type: String, required: true, trim: true },
    sport_type: { type: String, required: true, index: true }, // badminton, football, tennis...
    price_per_hour: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR' },
    operating_hours: { type: OperatingHoursSchema, required: true },
    notes: { type: String },
    is_active: { type: Boolean, default: true, index: true }
  },
  { timestamps:true  }
);

module.exports = mongoose.model('Court', CourtSchema);
