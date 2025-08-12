const mongoose = require('mongoose');
const { BOOKING_STATUS, PAYMENT_STATUS } = require('../helper/constant.helper');
const { paginate, toJSON } = require('./plugins');

const SlotSchema = new mongoose.Schema(
    {
        start_at: { type: Date, required: true },
        end_at: { type: Date, required: true },
    },
    { _id: false }
);

const BookingSchema = new mongoose.Schema(
    {
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        venue_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Venue',
            required: true,
            index: true,
        },
        sport_type: { type: String, required: true, index: true },

        slot: { type: SlotSchema, required: true },
        court_names: [{ type: String, required: true }],

        total_price: { type: Number, required: true, min: 0 },
        currency: { type: String, default: 'INR' },

        booking_status: {
            type: String,
            enum: Object.values(BOOKING_STATUS),
            default: BOOKING_STATUS.PENDING,
            index: true,
        },
        payment_status: {
            type: String,
            enum: Object.values(PAYMENT_STATUS),
            default: PAYMENT_STATUS.PENDING,
            index: true,
        },

        notes: { type: String, default: '' },

        // Timestamps for business logic
        cancelled_at: { type: Date, default: null },
        status_updated_at: { type: Date, default: null },
        updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

        // Soft delete
        deleted_at: { type: Date, default: null },
    },
    { timestamps: true }
);

// fast lists
BookingSchema.index({ user_id: 1, created_at: -1 });
BookingSchema.index({ venue_id: 1, 'slot.start_at': 1 });

// assist overlap lookups (partial on active statuses)
BookingSchema.index(
    { venue_id: 1, 'slot.start_at': 1, 'slot.end_at': 1 },
    { partialFilterExpression: { booking_status: { $in: ['pending', 'confirmed'] } } }
);

// Court availability lookup
BookingSchema.index({ court_names: 1, 'slot.start_at': 1, 'slot.end_at': 1 });

BookingSchema.plugin(paginate);
BookingSchema.plugin(toJSON);

module.exports = mongoose.model('Booking', BookingSchema);
