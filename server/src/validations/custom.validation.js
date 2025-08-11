/**
 * All custom validations are exported from here 👇
 */
module.exports = {
    /**
     * Create a common function for check mongodb's objectId is valid or not.
     */
    objectId: (value, helpers) => {
        if (!value.match(/^[0-9a-fA-F]{24}$/)) {
            return helpers.message('"{{#label}}" must be a valid mongo id');
        }
        return value;
    },

    /**
     * Create a common function for check the password is valid or not.
     */
    password: (value, helpers) => {
        // At least one uppercase, one number, one special (any non-alphanumeric), length 8-20, no spaces
        const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])\S{8,20}$/;
        if (!regex.test(value)) {
            return helpers.message(
                'Use 8-20 characters with at least one uppercase letter, one number, and one special symbol'
            );
        }
        return value;
    },
};
