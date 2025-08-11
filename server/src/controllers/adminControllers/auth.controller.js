const httpStatus = require('http-status');
const { userService, tokenService, roleService } = require('../../services');
const ApiError = require('../../utils/apiError');
const catchAsync = require('../../utils/catchAsync');
 
const { ROLES } = require('../../helper/constant.helper');

/**
 * All admin controllers are exported from here 👇
 */
module.exports = {
    /**
     * POST: Admin login.
     */
    adminLogin: catchAsync(async (req, res) => {
        const { body } = req;
        let data = {};

        const adminRoleId = (await roleService.getRoleByName(ROLES.admin))._id; // Get admin role ID.
        let emailExist = await userService.get({
            email: body.email,
            role: adminRoleId,
            deleted_at: null,
        }); // Get admin by email.
        if (!emailExist) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Email not found'); // If email doesn't exist, throw an error.
        }

        if (!emailExist.password || !(await emailExist.isPasswordMatch(body.password))) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is wrong'); // If password doesn't match the admin's password, throw an error.
        }

        data.user = emailExist;
        data.tokens = await tokenService.generateAuthTokens(emailExist); // Generate auth tokens.

        res.status(httpStatus.OK).json({
            success: true,
            message: 'Login successfully',
            data,
        });
    }),
};
