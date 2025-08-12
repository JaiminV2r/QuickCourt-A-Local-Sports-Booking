const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { toJSON } = require('./plugins');

const SALT_ROUNDS = 10;

const otpSchema = new mongoose.Schema(
    {
        otp_hash: {
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
        attempt_count: {
            type: Number,
            default: 0,
            max: 5,
        },
        is_used: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Hide sensitive fields on toJSON
otpSchema.set('toJSON', {
    transform: (_, ret) => {
        delete ret.otp_hash;
        return ret;
    },
});

// Instance method: compare candidate OTP
otpSchema.methods.compareOtp = async function (candidateOtp) {
    return bcrypt.compare(candidateOtp, this.otp_hash);
};

// Static method: create OTP with hashing
otpSchema.statics.createOtp = async function (userId, plainOtp, expiresAt) {
    const otpHash = await bcrypt.hash(plainOtp, SALT_ROUNDS);
    return this.create({
        otp_hash: otpHash,
        user: userId,
        expires_at: expiresAt,
        attempt_count: 0,
        is_used: false,
    });
};

otpSchema.plugin(toJSON);

const Otp = mongoose.model('Otp', otpSchema);
module.exports = Otp;
