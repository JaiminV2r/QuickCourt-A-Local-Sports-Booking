const moment = require('moment');
const { Otp } = require('../models');
const config = require('../config/config');

const generateOtp = () => ('000000' + Math.floor(Math.random() * 1000000)).slice(-6);

exports.createOrReplace = async (userId) => {
    const otp = generateOtp();
    const expiresAt = moment().add(config.jwt.otpExpirationMinutes, 'minutes').toDate();
    await Otp.findOneAndUpdate(
        { user: userId },
        { otp, user: userId, expires_at: expiresAt },
        { upsert: true, new: true }
    );
    return { otp, expires_at: expiresAt };
};

exports.verifyAndConsume = async (userId, otp) => {
    const record = await Otp.findOne({ user: userId, otp });
    if (!record) return { ok: false, reason: 'invalid' };
    if (record.expires_at <= new Date()) return { ok: false, reason: 'expired' };
    await Otp.deleteOne({ _id: record._id });
    return { ok: true };
};

exports.deleteByUser = async (userId) => {
    await Otp.deleteMany({ user: userId });
};
