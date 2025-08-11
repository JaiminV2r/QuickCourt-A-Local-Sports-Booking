// backend/src/controllers/ownerControllers/venueController.js
const catchAsync = require('../../utils/catchAsync');
const Venue = require('../../models/venue.model');
const { cldUploadBuffer, cldDeleteImage, cldDeleteVideo } = require('../../utils/cloudnairy.utils');
const { default: mongoose } = require('mongoose');
const { venueService } = require('../../services');
const { Court } = require('../../models');

module.exports = {
  createVenue: catchAsync(async (req, res) => {
    // 1) Build payload (no media in body)
    const payload = {
      owner_id: new mongoose.Types.ObjectId(req.user.
        _id
      ), // facility owner
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

  // Implementing the update function for venue update
  updateVenue: catchAsync(async (req, res) => {
    const { id } = req.params;

    // Find the venue by ID
    let venue = await venueService.get(id);
    if (!venue) {
      return res.status(404).json({
        success: false,
        message: 'Venue not found',
      });
    }

    // 1) Update the venue fields
    venue.venue_name = req.body.venue_name || venue.venue_name;
    venue.description = req.body.description || venue.description;
    venue.address = req.body.address || venue.address;
    venue.city = req.body.city || venue.city;
    venue.location = req.body.location || venue.location;
    venue.sports = req.body.sports || venue.sports;
    venue.amenities = req.body.amenities || venue.amenities;
    venue.about = req.body.about || venue.about;
    venue.venue_type = req.body.venue_type || venue.venue_type;
    venue.starting_price_per_hour = req.body.starting_price_per_hour || venue.starting_price_per_hour;

    // 2) Handle images - Adding new images or updating old ones
    const imageFiles = (req.files && req.files.images) || [];
    if (imageFiles.length > 0) {
      // Remove old images if new ones are being uploaded
      if (venue.photos && venue.photos.length > 0) {
        for (const photo of venue.photos) {
          await cldDeleteImage(photo); // Assuming cldDeleteImage is a function to delete old images
        }
      }

      // Upload new images and push to photos array
      venue.photos = [];
      for (const f of imageFiles) {
        if (!f.mimetype.startsWith('image/')) continue;
        const r = await cldUploadBuffer(f.buffer, { type: 'venue', resource_type: 'image' });
        venue.photos.push(r.public_id.split('/').pop());
      }
    }

    // 3) Handle videos - Adding new videos
    const videoFiles = (req.files && req.files.videos) || [];
    if (videoFiles.length > 0) {
      // Remove old videos if new ones are uploaded
      if (venue.videos && venue.videos.length > 0) {
        for (const video of venue.videos) {
          await cldDeleteVideo(video); // Assuming cldDeleteVideo is a function to delete old videos
        }
      }

      // Upload new videos and push to videos array
      venue.videos = [];
      for (const f of videoFiles) {
        if (!f.mimetype.startsWith('video/')) continue;
        const r = await cldUploadBuffer(f.buffer, { type: 'venue_video', resource_type: 'video' });
        venue.videos.push(r.public_id.split('/').pop());
      }
    }

    // Save the updated venue
    await venue.save();

    return res.status(200).json({
      success: true,
      message: 'Venue updated successfully',
      data: venue.toJSON(), // will include updated photo_urls & video_urls
    });
  }),

  getAllVenues: catchAsync(async (req, res) => {

    const { page = 1, limit = 10, search = '' } = req.query;

    // Build query
    const query = {
      owner_id: new mongoose.Types.ObjectId(req.user._id),
      venue_name: { $regex: search, $options: 'i' }, // case-insensitive search
    };

    // Pagination
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 }, // newest first
    };

    // Fetch venues with pagination
    const venues = await venueService.getAll(query, options);

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
  }),

  deleteVenue: catchAsync(async (req,res)=>{
    const { id } = req.params;

    const venue = await venueService.get(id);
    if (!venue) {
      return res.status(404).json({
        success: false,
        message: 'Venue not found',
      });
    }

    // Delete images from Cloudinary
    if (venue.photos && venue.photos.length > 0) {
      for (const photo of venue.photos) {
        await cldDeleteImage(photo);
      }
    }

    // Delete videos from Cloudinary
    if (venue.videos && venue.videos.length > 0) {
      for (const video of venue.videos) {
        await cldDeleteVideo(video);
      }
    }

    // Delete venue from database
    await venueService.softDelete(id);
    await Court.updateMany({ venue_id: id }, { deleted_at: new Date() });

    return res.status(200).json({
      success: true,
      message: 'Venue deleted successfully',
    });
  }),

  // Add court to venue
  addCourtToVenue: catchAsync(async (req, res) => {
  const { courts}= req.body;
  const courtsData = await Court.insertMany(courts);

  return res.status(201).json({
    success: true,
    message: 'Courts added successfully',
    data: courtsData,
  });
}),

  // Update court details
  updateCourtInVenue: catchAsync(async (req, res) => {
    const { court_id, } = req.params;
    const { court_name, court_type, operating_hours } = req.body;

    const updateCourt = await Court.updateOne(
      { _id: court_id },
      {
        court_name,
        court_type,
        operating_hours
      }
    );

    return res.status(200).json({
      success: true,
      message: 'Court updated successfully',
      data: updateCourt,
    });
  }),

  // Delete court from venue
  deleteCourtFromVenue: catchAsync(async (req, res) => {
    const {  court_id } = req.params;

    const court = await Court.find({_id:court_id});
    if (!court) {
      return res.status(404).json({
        success: false,
        message: 'Court not found',
      });
    }

  await Court.updateOne({_id:court_id}, {
    deleted_at: new Date()
  });


    return res.status(200).json({
      success: true,
      message: 'Court deleted successfully',
    });
  }),
};
