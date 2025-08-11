const Joi = require('joi');

module.exports = {
    getCities: {
        query: Joi.object().keys({
            page: Joi.number().integer().min(1).default(1),
            limit: Joi.number().integer().min(1).max(100).default(10),
            search: Joi.string().trim().allow(''),
            sort_by: Joi.string().trim().valid('name:asc', 'name:desc').default('name:asc'),
        }),
    },
};
