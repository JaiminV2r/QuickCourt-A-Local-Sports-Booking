const { ROLES, FILES_FOLDER, FILE_QUALITY } = require('../helper/constant.helper');
const { User } = require('../models');
const { getRoleByName } = require('./role.service');

let userRoleId, adminRoleId;

/**
 * This IIFE function must be called after the role seeder has run.
 */
(async () => {
    userRoleId = (await getRoleByName(ROLES.user))._id;
    adminRoleId = (await getRoleByName(ROLES.admin))._id;
})();

/**
 * Create a user.
 * @param {Object} data
 * @returns {Promise<User>}
 */
exports.create = async (data) => {
    return User.create(data);
};
/**
 * Update user details by filter with options
 * @param {Object} filter
 * @param {Object} update
 * @param {import('mongoose').QueryOptions} options
 * @returns {Promise<User>}
 */
exports.update = async (filter, update, options = {}) => {
    return User.findOneAndUpdate(filter, update, options);
};
/**
 * Get user by filter.
 * @param {Object} filter
 * @returns {Promise<User>}
 */
exports.get = async (filter) => {
    return User.findOne(filter);
};
/**
 * Get users by filter.
 * @param {Object} filter
 * @returns {Promise<User>}
 */
exports.getAll = async (filter, options = {}) => {
    return User.paginate(filter, options);
};

/**
 * Aggregate users by filter.
 * @param {Object} filter
 * @returns {Promise<User>}
 */
exports.aggregate = async (filter) => {
    return User.aggregate(filter);
};
/**
 * Delete a user(HARD DELETE).
 * @param {import('mongoose').ObjectId} userId
 * @returns {Promise<User>}
 */
exports.delete = async (filter) => {
    return User.deleteOne(filter);
};

/**
 * Soft delete a user.
 * @param {filter}  filter
 * @param {Object} data
 */
exports.softDelete = async (filter) => {
    return User.findOneAndUpdate(
        filter,
        {
            $set: {
                deleted_at: new Date(),
                // ...data
            },
        },
        { new: true }
    );
};

// exports.paginate = async (filter, options, imageKeys) => {
//     let users = await User.paginate(filter, options);

//     if (Object.values(imageKeys).length) {
//         users = JSON.parse(JSON.stringify(users)); // Data parse.

//         users.results = users.results.map((ele) => this.createImageURL(ele, imageKeys)); // Create images URLs.
//     }

//     return users;
// };
