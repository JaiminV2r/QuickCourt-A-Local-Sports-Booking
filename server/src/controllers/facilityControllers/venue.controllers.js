// backend/src/controllers/ownerControllers/venueController.js
const catchAsync = require('../../utils/catchAsync');
const { default: mongoose } = require('mongoose');
const { venueService, fileService } = require('../../services');
const { Court } = require('../../models');
const { paginationQuery } = require('../../helper/mongoose.helper');
const { VENUE_STATUS, FILES_FOLDER } = require('../../helper/constant.helper');
const { str2regex } = require('../../helper/function.helper');
const config = require('../../config/config');
const path = require('path');

module.exports = {
    createVenue: catchAsync(async (req, res) => {
        const { files } = req;

        // 1) Build payload (no media in body)
        const payload = {
            owner_id: new mongoose.Types.ObjectId(req.user._id), // facility owner
            venue_name: req.body.venue_name,
            description: req.body.description || '',
            address: req.body.address,
            city: req.body.city,
            location: req.body.location, // { type:'Point', coordinates:[lng,lat] } optional
            sports: req.body.sports || [],
            amenities: req.body.amenities || [],
            about: req.body.about || null,
            phone: req.body.phone || null,
            // optional: venue_status stays default (PENDING)
        };

        if (files?.length) {
            const { name } = await fileService.saveFile({
                file: files,
                folderName: FILES_FOLDER.venueImages,
            });

            payload.images = name;
        }

        const venue = await venueService.create(payload);

        return res.status(201).json({
            success: true,
            message: 'Venue created successfully',
            data: venue.toJSON(), // will include photo_urls & video_urls
        });
    }),

    // Implementing the update function for venue update
    updateVenue: catchAsync(async (req, res) => {
        const {
            body: { remove_images, ...body },
            params: { id },
            files,
        } = req;

        // Find the venue by ID
        let venue = await venueService.get({ _id: id });
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
        venue.venue_status = VENUE_STATUS.PENDING;
        venue.starting_price_per_hour =
            req.body.starting_price_per_hour || venue.starting_price_per_hour;
            venue.phone = req.body.phone || venue.phone;

        if (remove_images?.length) {
            fileService.deleteFiles(
                remove_images.map((image) =>
                    path.join(
                        __dirname,
                        `../../../${FILES_FOLDER.public}/${FILES_FOLDER.venueImages}/${image}`
                    )
                )
            );

            body.images = venue.images.filter((image) => !remove_images.includes(image));
        }

        if (files.length) {
            const { name } = await fileService.saveFile({
                file: files,
                folderName: FILES_FOLDER.venueImages,
            });

            body.images = remove_images?.length
                ? [...body.images, ...name]
                : [...venue.images, ...name];
        }

        Object.assign(venue, body);

        // Save the updated venue
        await venue.save();

        return res.status(200).json({
            success: true,
            message: 'Venue updated successfully',
            data: venue.toJSON(), // will include updated photo_urls & video_urls
        });
    }),

    getAllVenues: catchAsync(async (req, res) => {
        let { page = 1, limit = 10, search = '', venue_status } = req.query;

        let filter = {
            owner_id: new mongoose.Types.ObjectId(req.user._id),
            deleted_at: null,
            $or: [],
        };

        if (venue_status) {
            filter.venue_status = venue_status;
        }

        if (search) {
            search = str2regex(search);
            filter.$or.push(
                { venue_name: { $regex: search, $options: 'i' } },
                { city: { $regex: search, $options: 'i' } }
            );
        }

        if (!filter.$or.length) delete filter.$or;

        // Pagination
        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            sort: { createdAt: -1 }, // newest first
        };

        // Fetch venues with pagination

        const pagination = paginationQuery(options, [
            {
                $lookup: {
                    from: 'courts',
                    localField: '_id',
                    foreignField: 'venue_id',
                    as: 'courts',
                },
            },
            {
                $addFields: {
                    images: {
                        $map: {
                            input: '$images',
                            as: 'image',
                            in: {
                                $concat: [
                                    `${config.base_url}/${FILES_FOLDER.venueImages}/`,
                                    '$$image',
                                ],
                            },
                        },
                    },
                },
            },
        ]);
        const [venuesData] = await venueService.aggregate([
            {
                $match: filter,
            },
            ...pagination,
        ]);

        return res.status(200).json({
            success: true,
            message: 'Venues fetched successfully',
            data: venuesData,
        });
    }),
    getAllApprovedVenues: catchAsync(async (req, res) => {
        let { page = 1, limit = 10, search = '' } = req.query;

        let filter = {
            deleted_at: null,
            venue_status: VENUE_STATUS.APPROVED, // Only fetch approved venues
            $or: [],
        };
        if (search) {
            search = str2regex(search);
            filter.$or.push(
                { venue_name: { $regex: search, $options: 'i' } },
                { city: { $regex: search, $options: 'i' } }
            );
        }

        if (!filter.$or.length) delete filter.$or;

        // Pagination
        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            sort: { createdAt: -1 }, // newest first
        };

        // Fetch venues with pagination

        const pagination = paginationQuery(options);
        const [venuesData] = await venueService.aggregate([
            {
                $match: filter,
            },
            {
                $lookup: {
                    from: 'courts',
                    localField: '_id',
                    foreignField: 'venue_id',
                    as: 'courts',
                },
            },
            ...pagination,
        ]);

        return res.status(200).json({
            success: true,
            message: 'Venues fetched successfully',
            data: venuesData,
        });
    }),

    getVenue: catchAsync(async (req, res) => {
        const { id } = req.params;

        const venue = await venueService.get({ _id: id });

        const courts = await Court.find({
            venue_id: new mongoose.Types.ObjectId(id),
            deleted_at: null,
        });
        if (!venue) {
            return res.status(404).json({
                success: false,
                message: 'Venue not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Venue fetched successfully',
            data: { venue, courts },
        });
    }),

    deleteVenue: catchAsync(async (req, res) => {
        const { id } = req.params;

        const venue = await venueService.get(id);
        if (!venue) {
            return res.status(404).json({
                success: false,
                message: 'Venue not found',
            });
        }

        if (venue?.images?.length) {
            fileService.deleteFiles(
                venue?.images.map((image) =>
                    path.join(
                        __dirname,
                        `../../../${FILES_FOLDER.public}/${FILES_FOLDER.venueImages}/${image}`
                    )
                )
            );
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
        const { courts } = req.body;
        const courtsData = await Court.insertMany(courts);

        return res.status(201).json({
            success: true,
            message: 'Courts added successfully',
            data: courtsData,
        });
    }),

    // Update court details
    updateCourtInVenue: catchAsync(async (req, res) => {
        const { court_id } = req.params;
        const { court_name, sport_type, availability } = req.body;

        const updateCourt = await Court.findOneAndUpdate(
            { _id: court_id },
            {
                court_name,
                sport_type,
                availability,
            },
            {
                new: true,
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
        const { court_id } = req.params;

        const court = await Court.find({ _id: court_id });
        if (!court) {
            return res.status(404).json({
                success: false,
                message: 'Court not found',
            });
        }

        await Court.updateOne(
            { _id: court_id },
            {
                deleted_at: new Date(),
            }
        );

        return res.status(200).json({
            success: true,
            message: 'Court deleted successfully',
        });
    }),
};
