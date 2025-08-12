const moment = require('moment');
const { Otp } = require('../models');
const config = require('../config/config');

const generateOtp = () => ('000000' + Math.floor(Math.random() * 1000000)).slice(-6);

exports.createOrReplace = async (userId) => {
    const plainOtp = generateOtp();
    const expiresAt = moment().add(config.jwt.otpExpirationMinutes, 'minutes').toDate();

    // Delete any existing OTP for this user
    await Otp.deleteMany({ user: userId });

    // Create new OTP with hashing
    await Otp.createOtp(userId, plainOtp, expiresAt);

    return {
        otp: plainOtp, // Return plain OTP for email sending
        expires_at: expiresAt,
    };
};

exports.verifyAndConsume = async (userId, candidateOtp) => {
    const record = await Otp.findOne({
        user: userId,
        is_used: false,
        expires_at: { $gt: new Date() },
    });

    if (!record) {
        return { ok: false, reason: 'not_found' };
    }

    if (record.expires_at <= new Date()) {
        return { ok: false, reason: 'expired' };
    }

    if (record.attempt_count >= 5) {
        return { ok: false, reason: 'max_attempts_exceeded' };
    }

    // Increment attempt count
    record.attempt_count += 1;
    await record.save();

    // Compare OTP
    const isOtpValid = await record.compareOtp(candidateOtp);

    if (!isOtpValid) {
        return { ok: false, reason: 'invalid' };
    }

    // Mark OTP as used and delete it
    record.is_used = true;
    await record.save();
    await Otp.deleteOne({ _id: record._id });

    return { ok: true };
};

exports.resendOtp = async (userId) => {
    // Check if user has recent OTP attempts
    const recentOtp = await Otp.findOne({
        user: userId,
        createdAt: { $gte: moment().subtract(1, 'minute').toDate() },
    });

    if (recentOtp) {
        return { ok: false, reason: 'too_soon' };
    }

    return await this.createOrReplace(userId);
};

exports.deleteByUser = async (userId) => {
    await Otp.deleteMany({ user: userId });
};

exports.cleanupExpiredOtps = async () => {
    const expiredDate = new Date();
    await Otp.deleteMany({ expires_at: { $lte: expiredDate } });
};
