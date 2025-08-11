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
        let { search, is_active, ...options } = req.query;
        const userRole = await roleService.getRoleByName(ROLES.player); // Get user role ID.
        const filter = {
            deleted_at: null,
            role: userRole._id, // Filter by user role.
        };

        if (search) {
            search = str2regex(search); // The search string is converted to a regex string.

            filter.$or = [{ full_name: { $regex: search, $options: 'i' } }];
        }

        if (typeof is_active === 'boolean') {
            filter.is_active = is_active;
        }

        res.status(httpStatus.OK).json({
            success: true,
            message: 'Get all user successfully',
            data: await userService.getAll(filter, options),
        });
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
};
