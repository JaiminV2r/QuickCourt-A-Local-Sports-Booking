const mongoose = require('mongoose');
const { paginate } = require('./plugins');

const citySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
        },
    },
    {
        versionKey: false,
    }
);

citySchema.plugin(paginate);
citySchema.index({ name: 1 });

const City = mongoose.model('City', citySchema);

module.exports = City;
