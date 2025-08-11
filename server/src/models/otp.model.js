const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const otpSchema = new mongoose.Schema(
    {
        otp: {
            type: String,
            required: true,
            index: true,
            trim: true,
        },
        user: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        expires_at: {
            type: Date,
            required: true,
            index: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

otpSchema.plugin(toJSON);

const Otp = mongoose.model('Otp', otpSchema);
module.exports = Otp;
