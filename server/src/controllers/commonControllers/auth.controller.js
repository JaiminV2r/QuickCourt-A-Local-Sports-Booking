const httpStatus = require('http-status');
const { userService, tokenService, emailService, roleService } = require('../../services');
const ApiError = require('../../utils/apiError');
const catchAsync = require('../../utils/catchAsync');
const bcrypt = require('bcryptjs');
const { TOKEN_TYPES, ROLES } = require('../../helper/constant.helper');
/**
 * All user controllers are exported from here 👇
 */
module.exports = {
    /**
     * POST: Register.
     */
    register: catchAsync(async (req, res) => {
        const { body } = req;
        const userRoleId = await roleService.getRoleByName(ROLES.user); // Get user role ID.
        const emailExist = await userService.get({ email: body.email, deleted_at: null }); // Get user by email.
        if (emailExist) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken'); // If email already exist, throw an error.
        }

        const user = await userService.create({ ...body, role: userRoleId._id }); // User create.

        const otp = await tokenService.generateOtpToken(user); // Generate OTP.

        const mailSent = await emailService.sendTemplateEmail({
            to: body.email,
            subject: 'Register!',
            template: 'otpEmailTemplate', // ✅ Dynamic template name
            data: {
                ...body,
                otp,
            },
        });

        if (!mailSent) {
            await userService.delete(user._id); // Delete user.
            await tokenService.deleteOne({ user: user._id }); // Delete token.
            throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong'); // If mail doesn't send, throw an error.
        }

        res.status(httpStatus.CREATED).json({
            success: true,
            message: 'OTP sent successfully',
        });
    }),

    /**
     * POST: Verify OTP.
     */
    verifyOtp: catchAsync(async (req, res) => {
        const { email, otp } = req.body;

        let emailExist = await userService.get({ email, deleted_at: null }); // Get user by email.

        if (!emailExist) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Email not found'); // If email doesn't exist, throw an error.
        }

        if (!emailExist.is_active) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Account blocked'); // If the user is blocked, throw an error.
        }

        let token = await tokenService.get({
            type: TOKEN_TYPES.verifyOtp,
            user: emailExist._id,
        });

        if (!token) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong'); // If token doesn't exist, throw an error.
        }

        if (token.token !== otp) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'OTP invalid'); // If otp doesn't match, throw an error.
        }

        if (token.expires <= new Date()) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'OTP expired'); // If otp expired, throw an error.
        }

        if (!emailExist.is_email_verified) {
            emailExist = await userService.update(
                { _id: emailExist._id },
                { $set: { is_email_verified: true } },
                { new: true }
            ); // If user isEmailVerified is false, Update (isEmailVerified: true) user by _id.
        }

        const tokens = await tokenService.generateAuthTokens(emailExist); // Generate auth token.

        res.status(httpStatus.OK).json({
            success: true,
            message: 'OTP verified successfully',
            data: { user: emailExist, tokens },
        });
    }),

    /**
     * POST: Login.
     */
    login: catchAsync(async (req, res) => {
        const { body } = req;

        let resMessage,
            data = {};

        let emailExist = await userService.get({ email: body.email, deleted_at: null }); // Get user by email.

        if (!emailExist) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Email not found'); // If email doesn't exist, throw an error.
        }

        if (!emailExist.is_active) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Account blocked'); // If the user is blocked, throw an error.
        }

        if (!emailExist.is_email_verified) {
            const otp = await tokenService.generateOtpToken(emailExist); // Generate OTP.

            const mailSent = await emailService.sendTemplateEmail({
                to: body.email,
                subject: 'Login!',
                template: 'otpEmailTemplate', // Use the relevant EJS template
                data: {
                    ...body,
                    otp,
                },
            });

            if (!mailSent) {
                throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong'); // If mail doesn't send, throw an error.
            }

            resMessage = 'OTP sent to your email';
        } else {
            if (!emailExist.password || !(await emailExist.isPasswordMatch(body.password))) {
                throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is wrong'); // If password doesn't match the user's password, throw an error.
            }

            data.user = emailExist;
            data.tokens = await tokenService.generateAuthTokens(emailExist); // Generate auth token.

            resMessage = 'Login successfully';
        }

        res.status(httpStatus.OK).json({ success: true, message: resMessage, data });
    }),

    /**
     * POST: Logout.
     */
    logout: catchAsync(async (req, res) => {
        const refreshToken = await tokenService.get({
            token: req.body.refresh_token,
            type: TOKEN_TYPES.refresh,
            blacklisted: false,
        }); // Get refresh token by filter.

        if (!refreshToken) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Refresh token not found'); // If refresh token doesn't exist, throw an error.
        }

        await tokenService.deleteMany({ user: refreshToken.user }); // Delete token.

        res.status(httpStatus.NO_CONTENT).json({
            success: true,
            message: 'Logout successfully',
        });
    }),

    /**
     * POST: Send OTP.
     */
    sendOtp: catchAsync(async (req, res) => {
        const { body } = req,
            emailExist = await userService.get({ email: body.email, deleted_at: null }); // Get user by email.

        if (!emailExist) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Email not found'); // If email doesn't exist, throw an error.
        }

        if (!emailExist.is_active) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Account blocked'); // If the user is blocked, throw an error.
        }

        const otp = await tokenService.generateOtpToken(emailExist); // Generate otp.

        const mailSent = await emailService.sendTemplateEmail({
            to: body.email,
            subject: 'Verify Mail!',
            template: 'otpEmailTemplate', // <---  TEmplate name in Views folder // ✅ Dynamic template name
            data: {
                ...body,
                otp,
            },
        });

        if (!mailSent) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong'); // If mail doesn't send, throw an error.
        }

        res.status(httpStatus.OK).json({
            success: true,
            message: 'OTP sent to your email',
        });
    }),

    /**
     * POST: Social login.
     */
    socialLogin: catchAsync(async (req, res) => {
        const { body } = req;
        const userRole = await roleService.getRoleByName(ROLES.user); // Get user role ID.
        let user = await userService.get({ email: body.email, deleted_at: null }); // Get user by email.

        user = !user
            ? await userService.create({
                  full_name: body.full_name,
                  email: body.email,
                  is_email_verified: true,
                  role: userRole._id,
              })
            : await userService.update(
                  { _id: user._id },
                  {
                      $set: {
                          is_email_verified: true,
                          role: userRole._id,
                      },
                  }
              );

        const tokens = await tokenService.generateAuthTokens(user); // Generate tokens.

        res.status(httpStatus.OK).json({
            success: true,
            message: 'Login successfully!',
            data: { user, tokens },
        });
    }),

    /**
     * PUT: Reset password.
     */
    resetPassword: catchAsync(async (req, res) => {
        const { body } = req;

        const emailExist = await userService.get({ email: body.email, deleted_at: null }); // Get user by email.

        if (!emailExist) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Email not found'); // If email doesn't exist, throw an error.
        }

        if (!emailExist.is_active) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Your account is blocked by admin.'); // If the user is blocked, throw an error.
        }

        let token = await tokenService.get({
            type: TOKEN_TYPES.verifyOtp,
            user: emailExist._id,
        }); // Get token by type and user.

        if (!token) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong'); // If token doesn't exist, throw an error.
        }

        if (token.token !== body.otp) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'OTP invalid'); // If otp doesn't match, throw an error.
        }

        const bcryptPassword = await bcrypt.hash(body.password, 8); // New password bcrypt.

        await userService.update({ _id: emailExist._id }, { $set: { password: bcryptPassword } }); // Update user password by _id.

        res.status(httpStatus.OK).json({
            success: true,
            message: 'Password reset successfully',
        });
    }),

    /**
     * PUT: Change password.
     */
    changePassword: catchAsync(async (req, res) => {
        const { user, body } = req;

        if (!(await user.isPasswordMatch(body.old_password))) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is wrong'); // If password doesn't match the user's password, throw an error.
        }

        const bcryptPassword = await bcrypt.hash(body.new_password, 8); // New password bcrypt.

        await userService.update({ _id: user._id }, { $set: { password: bcryptPassword } }); // Update user password by _id.

        res.status(httpStatus.OK).json({
            success: true,
            message: 'Password changed successfully',
        });
    }),
};
