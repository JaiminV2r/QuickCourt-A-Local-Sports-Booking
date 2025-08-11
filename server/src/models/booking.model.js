const mongoose = require('mongoose');
const { BOOKING } = require('../helper/constant.helper');
const {paginate , toJSON} = require('./plugins')
const SlotSchema = new mongoose.Schema(
  {
    start_at: { type: Date, required: true },
    end_at: { type: Date, required: true }
  },
  { _id: false }
);

const BookingSchema = new mongoose.Schema(
  {
    user_id:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    venue_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue', required: true, index: true },
    court_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Court', required: true, index: true },

    // denorm for faster admin/owner charts (no lookup)
    sport: { type: Object, ref: 'Sport' },

    booking_date: { type: Date, required: true, index: true }, // UTC day start of local date
    slot: { type: SlotSchema, required: true },

    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR' },

    status: { type: String, enum: Object.values(BOOKING.STATUS), default: BOOKING.STATUS.CONFIRMED, index: true },

    notes: { type: String , default: '' },
  },
  { timestamps:true }
);

// fast lists
BookingSchema.index({ user_id: 1, created_at: -1 });
BookingSchema.index({ venue_id: 1, booking_date: 1 });

// assist overlap lookups (partial on active statuses)
BookingSchema.index(
  { court_id: 1, 'slot.start_at': 1, 'slot.end_at': 1 },
  { partialFilterExpression: { status: { $in: ['confirmed', 'completed'] } } }
);

BookingSchema.plugin(paginate);
BookingSchema.plugin(toJSON);

module.exports = mongoose.model('Booking', BookingSchema);
