const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {toJSON , paginate} = require('./plugins')

const CourtSchema = new Schema({
  venue_id: {
    type: Schema.Types.ObjectId,
    ref: 'Venue',
    required: true
  },
  court_name: { type: [String], required: true },
  sport_type: { type: String, required: true },
  availability: [
    {
      day_of_week: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], required: true },
      time_slots: [
        {
          start_time: { type: Date, required: true }, // Example: "07:00 AM"
          end_time: { type: Date, required: true },   // Example: "10:00 AM"
          price: { type: Number, required: true },
          is_maintenance: { type: Boolean, default: false }  // Whether the time slot is blocked for maintenance
        }
      ]
    }
  ],
  deleted_at: { type: Date, default: null }
},{
  timestamps:true,
});


CourtSchema.plugin(toJSON);
CourtSchema.plugin(paginate);

module.exports = mongoose.model('Court', CourtSchema);
