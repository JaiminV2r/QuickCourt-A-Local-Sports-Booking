const httpStatus = require('http-status');
const { userService, roleService } = require('../../services');
const ApiError = require('../../utils/apiError');
const catchAsync = require('../../utils/catchAsync');
const { str2regex } = require('../../helper/function.helper');

const { ROLES } = require('../../helper/constant.helper');

/**
 * All users controllers are exported from here 👇
 */
module.exports = {
    /**
     * GET: Get all user.
     */
    getAllUser: catchAsync(async (req, res) => {
        try {
            let { search, is_active, role, ...options } = req.query;
            console.log('Admin getAllUser called with params:', { search, is_active, role, options });
            
            const filter = {
                deleted_at: null,
            };

            // Handle role filtering
            if (role) {
                try {
                    // First try to find role by name
                    const roleObj = await roleService.getRoleByName(role);
                    if (roleObj) {
                        filter.role = roleObj._id;
                        console.log('Role found by name:', role, 'ID:', roleObj._id);
                    }
                } catch (error) {
                    // If role name not found, check if it's a valid ObjectId
                    if (role.match(/^[0-9a-fA-F]{24}$/)) {
                        // It's a valid ObjectId, use it directly
                        filter.role = role;
                        console.log('Role used as ObjectId:', role);
                    } else {
                        // Invalid role, return empty results
                        filter.role = null;
                        console.log('Invalid role, setting filter.role to null');
                    }
                }
            } else {
                // Default: filter by player role if no role specified
                try {
                    const userRole = await roleService.getRoleByName(ROLES.player);
                    filter.role = userRole._id;
                    console.log('Default role (player) found:', userRole._id);
                } catch (error) {
                    // If player role not found, don't filter by role
                    console.warn('Player role not found, skipping role filter');
                }
            }

            // Handle search filtering (search in both name and email)
            if (search) {
                search = str2regex(search);
                filter.$or = [
                    { full_name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ];
                console.log('Search filter applied:', filter.$or);
            }

            // Handle active status filtering
            if (is_active !== undefined && is_active !== '') {
                // Convert string to boolean if needed
                if (typeof is_active === 'string') {
                    if (is_active === 'true') {
                        filter.is_active = true;
                    } else if (is_active === 'false') {
                        filter.is_active = false;
                    }
                } else {
                    filter.is_active = is_active;
                }
                console.log('Active status filter applied:', filter.is_active);
            }

            console.log('Final filter:', filter);

            // Get users with filters and pagination
            const result = await userService.getAll(filter, options);

            // Add filter info to response for debugging
            const responseData = {
                ...result,
                filters: {
                    search: search || null,
                    is_active: filter.is_active,
                    role: filter.role,
                    appliedFilters: Object.keys(filter).filter(key => key !== 'deleted_at')
                }
            };

            console.log('Response data:', responseData);

            res.status(httpStatus.OK).json({
                success: true,
                message: 'Get all users successfully',
                data: responseData,
            });
        } catch (error) {
            console.error('Error in getAllUser:', error);
            throw error;
        }
    }),

    /**
     * GET: Get single user.
     */
    getUserById: catchAsync(async (req, res) => {
        const userId = req.params.userId,
            userExist = await userService.get({ _id: userId }); // Get user by _id.

        if (!userExist) {
            throw new ApiError(httpStatus.NOT_FOUND, 'User not found'); // If user doesn't exist, throw an error.
        }

        res.status(httpStatus.OK).json({
            success: true,
            message: 'Get user successfully',
            data: userExist,
        });
    }),

    /**
     * PATCH: Block/Unblock user.
     */
    blockUser: catchAsync(async (req, res) => {
        const userId = req.params.userId,
            userExist = await userService.get({ _id: userId }); // Get user by _id.

        if (!userExist) {
            throw new ApiError(httpStatus.NOT_FOUND, 'User not found'); // If user doesn't exist, throw an error.
        }

        res.status(httpStatus.OK).json({
            success: true,
            message: userExist.is_active
                ? 'User blocked successfully'
                : 'User unblocked successfully',

            data: await userService.update(
                { _id: userId },
                { $set: { is_active: !userExist.is_active } },
                { new: true }
            ), // Update user by _id (block/unBLock).
        });
    }),

    /**
     * DELETE: Delete user by _id (SOFT DELETE).
     */
    deleteUser: catchAsync(async (req, res) => {
        const userId = req.params.userId,
            userExist = await userService.get({ _id: userId }); // Get user by _id.

        if (!userExist) {
            throw new ApiError(httpStatus.NOT_FOUND, 'User not found'); // If user doesn't exist, throw an error.
        }

        await userService.update({ _id: userId }, { $set: { deleted_at: new Date() } }); // Update user by _id (Delete user).

        res.status(httpStatus.OK).json({
            success: true,
            message: 'User deleted successfully',
        });
    }),

    /**
     * GET: Get user booking history.
     */
    getUserBookingHistory: catchAsync(async (req, res) => {
        try {
            const userId = req.params.userId;
            console.log('Admin getUserBookingHistory called for userId:', userId);
            
            // Check if user exists
            const userExist = await userService.get({ _id: userId });
            if (!userExist) {
                throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
            }

            // Get query parameters for pagination and filtering
            const { page = 1, limit = 10, status, fromDate, toDate, sport, ...options } = req.query;
            console.log('Booking history query params:', { page, limit, status, fromDate, toDate, sport });
            
            // Build filter for bookings
            const filter = { user_id: userId };
            
            // Add status filter if provided
            if (status && status !== 'all') {
                filter.status = status;
            }
            
            // Add sport filter if provided
            if (sport) {
                filter['sport.name'] = { $regex: sport, $options: 'i' };
            }
            
            // Add date range filter if provided
            if (fromDate || toDate) {
                filter.booking_date = {};
                if (fromDate) {
                    filter.booking_date.$gte = new Date(fromDate);
                }
                if (toDate) {
                    filter.booking_date.$lte = new Date(toDate);
                }
            }

            console.log('Final booking filter:', filter);

            // Get booking history with pagination
            const result = await userService.getUserBookingHistory(filter, {
                page: parseInt(page),
                limit: parseInt(limit),
                populate: 'venue_id court_id',
                sort_by: 'booking_date:desc',
                ...options
            });

            // Transform the results to include sport information
            if (result.results && Array.isArray(result.results)) {
                let totalAmount = 0;
                
                result.results = result.results.map(booking => {
                    const transformed = booking.toObject ? booking.toObject() : booking;
                    
                    // Extract sport information from the sport field
                    if (transformed.sport) {
                        transformed.sport_name = transformed.sport.name || 'Unknown Sport';
                        transformed.sport_icon = transformed.sport.icon || '🏟️';
                    }
                    
                    // Format the booking date
                    if (transformed.booking_date) {
                        transformed.formatted_date = new Date(transformed.booking_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        });
                    }
                    
                    // Format the slot time
                    if (transformed.slot) {
                        if (transformed.slot.start_at) {
                            transformed.start_time = new Date(transformed.slot.start_at).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                            });
                        }
                        if (transformed.slot.end_at) {
                            transformed.end_time = new Date(transformed.slot.end_at).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                            });
                        }
                    }
                    
                    // Add venue information
                    if (transformed.venue_id) {
                        transformed.venue_name = transformed.venue_id.venue_name || 'Unknown Venue';
                        transformed.venue_address = transformed.venue_id.address || 'No Address';
                    }
                    
                    // Add court information
                    if (transformed.court_id) {
                        transformed.court_name = transformed.court_id.name || 'Unknown Court';
                    }
                    
                    // Calculate total amount
                    if (transformed.amount) {
                        totalAmount += transformed.amount;
                    }
                    
                    return transformed;
                });
                
                // Add summary information
                result.summary = {
                    total_bookings: result.totalResults,
                    total_amount: totalAmount,
                    currency: 'INR'
                };
            }

            console.log('Transformed booking history result:', result);

            res.status(httpStatus.OK).json({
                success: true,
                message: 'Get user booking history successfully',
                data: result,
            });
        } catch (error) {
            console.error('Error in getUserBookingHistory:', error);
            throw error;
        }
    }),
};
