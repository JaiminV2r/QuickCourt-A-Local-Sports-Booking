const httpStatus = require('http-status');
const { Role } = require('../models');
const ApiError = require('../utils/apiError');
 

/**
 * Get role by name.
 * @param {String} roleName
 * @returns {Promise<Role>}
 */
exports.getRoleByName = async (roleName) => {
    const role = await Role.findOne({ role: roleName, deleted_at: null });

    if (!role) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Role not found'); // If role doesn't exist, throw an error.
    }

    return role;
};
