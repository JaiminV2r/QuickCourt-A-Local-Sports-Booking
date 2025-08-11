const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const cityService = require('../../services/city.service');

module.exports = {
    /** Get city list with filter and pagination */
    getCities: catchAsync(async (req, res) => {
        const {
            query: { search, ...options },
        } = req;

        let filter = {};

        if (search) {
            filter.name = { $regex: search, $options: 'i' };
        }

        const list = await cityService.getAllCities(filter, options);

        res.status(httpStatus.OK).json({
            success: true,
            message: 'Cities fetched successfully',
            data: list,
        });
    }),
};
