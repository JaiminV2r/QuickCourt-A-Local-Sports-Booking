// backend/src/controllers/ownerControllers/venueController.js
const catchAsync = require('../../utils/catchAsync');
const Venue = require('../../models/venue.model');
const { cldUploadBuffer } = require('../../utils/cloudnairy.utils');
const { default: mongoose } = require('mongoose');
const { venueService } = require('../../services');

module.exports = {
  createVenue: catchAsync(async (req, res) => {
    // 1) Build payload (no media in body)
    const payload = {
      owner_id: new mongoose.Types.ObjectId("6899c748af4533c928af7894"), // facility owner
      venue_name: req.body.venue_name,
      description: req.body.description || '',
      address: req.body.address,
      city: req.body.city,
      location: req.body.location, // { type:'Point', coordinates:[lng,lat] } optional
      sports: req.body.sports || [],
      amenities: req.body.amenities || [],
      about: req.body.about || null,
      // optional: venue_status stays default (PENDING)
    };

    const venue = await venueService.create(payload);

    // Ensure arrays exist
    if (!Array.isArray(venue.photos)) venue.photos = [];
    if (!Array.isArray(venue.videos)) venue.videos = [];

    // 2) images[] (multipart)
    const imageFiles = (req.files && req.files.images) || [];
    for (const f of imageFiles) {
      if (!f.mimetype.startsWith('image/')) continue;
      const r = await cldUploadBuffer(f.buffer, { type: 'venue', resource_type: 'image' });
      venue.photos.push(r.public_id.split('/').pop());
    }

    // 3) videos[] (multipart)
    const videoFiles = (req.files && req.files.videos) || [];
    for (const f of videoFiles) {
      if (!f.mimetype.startsWith('video/')) continue;
      const r = await cldUploadBuffer(f.buffer, { type: 'venue_video', resource_type: 'video' });
      venue.videos.push(r.public_id.split('/').pop());
    }

    await venue.save();

    return res.status(201).json({
      success: true,
      message: 'Venue created successfully',
      data: venue.toJSON(), // will include photo_urls & video_urls
    });
  }),


  getAllVenues: catchAsync(async (req, res) => {

    const { page = 1, limit = 10, search = '' } = req.query;

    // Build query
    const query = {
      owner_id: new mongoose.Types.ObjectId("6899c748af4533c928af7894"),
      venue_name: { $regex: search, $options: 'i' }, // case-insensitive search
    };

    // Pagination
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 }, // newest first
    };

    // Fetch venues with pagination
    const venues = await Venue.paginate(query, options);

    return res.status(200).json({
      success: true,
      message: 'Venues fetched successfully',
      data: venues,
    });




  }),

  getVenue: catchAsync(async (req, res) => {
    const { id } = req.params;

    const venue = await venueService.get(id);

    if (!venue) {
      return res.status(404).json({
        success: false,
        message: 'Venue not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Venue fetched successfully',
      data: venue,
    });
  })
};
