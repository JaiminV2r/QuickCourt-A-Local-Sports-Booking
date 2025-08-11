const httpStatus = require('http-status');
const {
    userService,
    tokenService,
    emailService,
    roleService,
    otpService,
} = require('../../services');
const ApiError = require('../../utils/apiError');
const catchAsync = require('../../utils/catchAsync');
const bcrypt = require('bcryptjs');
const { TOKEN_TYPES, ROLES, FILES_FOLDER } = require('../../helper/constant.helper');
/**
 * All user controllers are exported from here 👇
 */
module.exports = {
    /**
     * POST: Register.
     */
    register: catchAsync(async (req, res) => {
        const { body } = req;
        const emailExist = await userService.get({
            email: body.email,
            role: body.role,
            deleted_at: null,
        }); // Get user by email.
        if (emailExist) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken with this role'); // If email already exist, throw an error.
        }

        const user = await userService.create({ ...body }); // User create.
        const { otp } = await otpService.createOrReplace(user._id); // Generate and store OTP.

        const mailSent = await emailService.sendTemplateEmail({
            to: body.email,
            subject: 'Register!',
            template: 'otpEmailTemplate', // ✅ Dynamic template name
            data: {
                full_name: body.full_name,
                email: body.email,
                otp,
                imageUrl: `${process.env.BASE_URL}/${FILES_FOLDER.default}/user_image.jpg`,
            },
        });

        if (!mailSent) {
            await userService.delete(user._id); // Delete user.
            await otpService.deleteByUser(user._id); // Delete OTPs.
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

        let emailExist = await userService.get(
            { email, deleted_at: null },
            {},
            {
                lean: true,
                populate: {
                    path: 'role',
                },
            }
        ); // Get user by email.

        if (!emailExist) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Email not found'); // If email doesn't exist, throw an error.
        }

        if (!emailExist.is_active) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Account blocked'); // If the user is blocked, throw an error.
        }

        const verify = await otpService.verifyAndConsume(emailExist._id, otp);
        if (!verify.ok) {
            if (verify.reason === 'expired')
                throw new ApiError(httpStatus.BAD_REQUEST, 'OTP expired');
            throw new ApiError(httpStatus.BAD_REQUEST, 'OTP invalid');
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
            data = {},
            isEmailNotVerify = false;

        let emailExist = await userService.get(
            { email: body.email, deleted_at: null },
            {},
            {
                // lean: true,
                populate: {
                    path: 'role',
                },
            }
        ); // Get user by email.

        if (!emailExist) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Email not found'); // If email doesn't exist, throw an error.
        }

        if (!emailExist.is_active) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Account blocked'); // If the user is blocked, throw an error.
        }

        if (!emailExist.is_email_verified) {
            const { otp } = await otpService.createOrReplace(emailExist._id); // Generate and store OTP.

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

            isEmailNotVerify = true;

            resMessage = 'OTP sent to your email';
        } else {
            if (!emailExist.password || !(await emailExist.isPasswordMatch(body.password))) {
                throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is wrong'); // If password doesn't match the user's password, throw an error.
            }

            data.user = emailExist;
            data.tokens = await tokenService.generateAuthTokens(emailExist); // Generate auth token.

            resMessage = 'Login successfully';
        }

        res.status(httpStatus.OK).json({
            success: true,
            message: resMessage,
            data,
            isEmailNotVerify,
        });
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

        const { otp } = await otpService.createOrReplace(emailExist._id); // Generate and store OTP.

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
        const userRole = await roleService.getRoleByName(ROLES.player); // Get user role ID.
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

    /**
     * POST: Forgot password.
     */
    forgotPassword: catchAsync(async (req, res) => {
        const { email } = req.body;

        const user = await userService.get({ email, deleted_at: null });
        if (!user) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Email not found');
        }

        if (!user.is_active) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Account blocked');
        }

        // Generate reset password token
        const resetToken = await tokenService.generateResetPasswordToken(user._id);

        // Create reset password link
        const resetLink = `${process.env.FRONT_URL}/reset-password?token=${resetToken}`;

        // Send email with reset link
        const mailSent = await emailService.sendTemplateEmail({
            to: email,
            subject: 'Reset Password',
            template: 'resetPasswordEmailTemplate',
            data: {
                full_name: user.full_name,
                email: user.email,
                reset_link: resetLink,
            },
        });

        if (!mailSent) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to send reset password email');
        }

        res.status(httpStatus.OK).json({
            success: true,
            message: 'Reset password link sent to your email',
        });
    }),

    /**
     * PUT: Reset password.
     */
    resetPassword: catchAsync(async (req, res) => {
        const { token, password: newPassword } = req.body;

        // Verify reset token
        const tokenData = await tokenService.verifyResetPasswordToken(token);
        if (!tokenData) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid or expired reset token');
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 8);

        // Update user password
        await userService.update({ _id: tokenData.user }, { $set: { password: hashedPassword } });

        // Delete the reset token
        await tokenService.deleteOne({ _id: tokenData._id });

        res.status(httpStatus.OK).json({
            success: true,
            message: 'Password reset successfully',
        });
    }),

    /**
     * GET: Get roles list (excluding Admin).
     */
    getRoles: catchAsync(async (req, res) => {
        const roles = await roleService.getRoleList(
            { role: { $ne: 'Admin' }, is_active: true, deleted_at: null },
            { role: 1, name: 1 }
        );

        res.status(httpStatus.OK).json({
            success: true,
            message: 'Roles retrieved successfully',
            data: roles,
        });
    }),

    update: catchAsync(async (req, res) => {
        const { user, body } = req;

        // Update user information
        await userService.update({ _id: user._id }, { $set: body });

        res.status(httpStatus.OK).json({
            success: true,
            message: 'User information updated successfully',
        });
    }),

};
