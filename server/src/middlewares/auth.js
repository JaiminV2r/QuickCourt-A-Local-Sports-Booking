const passport = require('passport');
const httpStatus = require('http-status');
const Role = require('../models/role.model');
const ApiError = require('../utils/apiError');
 

const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
    if (err || info || !user) {
        return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please login to access this resource'));
    }

    const role = await Role.findOne({ _id: user.role }); // Get role by _id.

    if (!role) {
        return reject(new ApiError(httpStatus.NOT_FOUND, 'Role not found')); // If role doesn't exist, throw an error.
    }

    if (!requiredRights.includes(role.role)) {
        return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden Access denied. You do not have permission to perform this action.')); // If user role doesn't include in role require rights, throw an error.
    }

    if (user?.is_active === false) {
        return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Account blocked')); // If user is block, throw an error.
    }

    req.user = user;
    req.user.role = role;

    resolve();
};

/**
 * Auth middleware.
 * @param  {Array} requiredRights
 * @returns
 */
exports.auth =
    (...requiredRights) =>
    async (req, res, next) => {
        return new Promise((resolve, reject) => {
            passport.authenticate(
                'jwt',
                { session: false },
                verifyCallback(req, resolve, reject, requiredRights)
            )(req, res, next);
        })
            .then(() => next())
            .catch((err) => next(err));
    };

/**
 * If token then decode else give access to get
 * @returns
 */
exports.authorizeV3 = () => async (req, res, next) => {
    const token = req.headers.authorization;

    if (token) {
        return new Promise(() => {
            passport.authenticate('jwt', { session: false })(req, res, next);
        })
            .then(() => next())
            .catch((err) => next(err));
    }

    next();
};
