const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

/**
 * All auth validations are exported from here 👇
 */
module.exports = {
    /**
     * Register.
     */
    register: {
        body: Joi.object().keys({
            full_name: Joi.string().trim().max(50).required(),
            email: Joi.string().trim().email().required(),
            password: Joi.string().trim().custom(password).required(),
            role: Joi.string().custom(objectId).required(),
        }),
    },

    /**
     * Verify OTP.
     */
    verifyOtp: {
        body: Joi.object().keys({
            email: Joi.string().trim().email().required(),
            otp: Joi.string().trim().length(6).required(),
        }),
    },

    /**
     * Login.
     */
    login: {
        body: Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().custom(password).required(),
        }),
    },

    /**
     * Logout.
     */
    logout: {
        body: Joi.object().keys({
            refresh_token: Joi.string().trim().required(),
        }),
    },

    /**
     * Send OTP.
     */
    sendOtp: {
        body: Joi.object().keys({
            email: Joi.string().trim().email().required(),
        }),
    },

    /**
     * Forgot password.
     */
    forgotPassword: {
        body: Joi.object().keys({
            email: Joi.string().trim().email().required(),
        }),
    },

    /**
     * Reset password.
     */
    resetPassword: {
        body: Joi.object().keys({
            token: Joi.string().trim().required(),
            password: Joi.string().custom(password).required(),
        }),
    },

    /**
     * Change password.
     */
    changePassword: {
        body: Joi.object().keys({
            old_password: Joi.string().custom(password).required(),
            new_password: Joi.string().custom(password).required(),
        }),
    },

    /**
     * update user
     */
updateUser: {
    body: Joi.object().keys({
        full_name: Joi.string().trim().max(50).optional(),
    }),
}
};
