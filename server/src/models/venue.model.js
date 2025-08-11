// backend/src/models/venue.model.js
const mongoose = require('mongoose');
const { VENUE_STATUS, SPORT_TYPE, AMENITIES } = require('../helper/constant.helper');
const { urlFromName } = require('../utils/cloudnairy.utils');

const { toJSON,paginate } = require('./plugins')
const VenueSchema = new mongoose.Schema(
  {
    owner_id: { type: mongoose.Types.ObjectId, ref: 'User', required: true, index: true },
   venue_name: { type: String, required: true, trim: true },
    description: String,
    address: { type: String,required: true },
    city: {
      type: String,
      required: true,
    },
location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
    },

    sports: [{ type: String , enum: Object.values(SPORT_TYPE), default : null}], // slugs
    amenities: [{
      type: String,
      enum: Object.values(AMENITIES),
      default: null
    }],

    // store ONLY image names; URLs are computed at response time
    photos: [String],
    video: { type: String, default: null },
  
    about:  [{ type: String, default: null }],

    // ratings for venue cards & detail
    rating: {
      avg: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },

    venue_status:{
      type: String,
      enum: Object.values(VENUE_STATUS),
      default: VENUE_STATUS.PENDING,
    },
    // soft activity flag
    is_active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

VenueSchema.plugin(paginate);
VenueSchema.plugin(toJSON);

// Add Cloudinary URLs at response time without storing them
VenueSchema.set('toJSON', {
  transform: (_, ret) => {
    ret.photoUrls = (ret.photos || []).map((name) =>
      urlFromName('venue', name, { w: 1600, h: 900 })
    );
    return ret;
  },
});

module.exports = mongoose.models.Venue || mongoose.model('Venue', VenueSchema);
