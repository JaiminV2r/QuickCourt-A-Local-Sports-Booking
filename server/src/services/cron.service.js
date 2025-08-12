const cron = require('node-cron');
const { otpService } = require('./index');

async function cron1() {
    // Cron1 code.
    console.log(':::::::::: Cron1 run successfully ::::::::::');
}

async function cron2() {
    // Cron2 code.
    console.log(':::::::::: Cron2 run successfully ::::::::::');
}

async function cleanupExpiredOtps() {
    try {
        await otpService.cleanupExpiredOtps();
        console.log(':::::::::: Expired OTPs cleaned up successfully ::::::::::');
    } catch (error) {
        console.error(':::::::::: Error cleaning up expired OTPs:', error.message);
    }
}

function runCron() {
    cron.schedule('0 0 0 * * *', cron1, { timezone: 'Asia/Kolkata' });
    cron.schedule('0 0 0 * * *', cron2, { timezone: 'Asia/Kolkata' });
    // Clean up expired OTPs every hour
    cron.schedule('0 0 * * * *', cleanupExpiredOtps, { timezone: 'Asia/Kolkata' });
}

/**
 * Cron services are exported from here 👇
 */
module.exports = runCron;
