const config = require('../config/config');
const logger = require('../config/logger');
const ejs = require('ejs');
const nodemailer = require('nodemailer');
const path = require('path');
const { FILES_FOLDER } = require('../helper/constant.helper');
const { first } = require('lodash');

const transport = nodemailer.createTransport(config.email.smtp);

transport
    .verify()
    .then(() => logger.info('📧 Connected to email server 📧'))
    .catch(() => logger.warn('❌ SMTP connection failed. Check .env configuration.'));

/**
 * Render EJS email template
 * @param {String} templateName - e.g. 'otpEmailTemplate'
 * @param {Object} variables - dynamic data for the template
 * @returns {Promise<String>} - rendered HTML
 */
const renderTemplate = (templateName, variables) => {
    const templatePath = path.join(__dirname, `../../views/${templateName}.ejs`);

    return new Promise((resolve, reject) => {
        ejs.renderFile(templatePath, variables, (err, html) => {
            if (err) reject(err);
            else resolve(html);
        });
    });
};

/**
 * Send email
 * @param {Object} options
 * @param {String} options.to
 * @param {String} options.subject
 * @param {String} options.template - EJS template name without .ejs
 * @param {Object} options.data - Data for EJS template
 */

// The function will render the EJS template with the provided data and send the email.
const sendTemplateEmail = async ({ to, subject, template, data }) => {
    try {
        let templateData = {
            fullName: first(data.full_name),
            email: data.email,
            imageUrl: `${process.env.BASE_URL}${FILES_FOLDER.default}/logo.jpeg`,
        };

        // Add template-specific data
        if (data.otp) {
            templateData.otp = data.otp;
        }
        if (data.reset_link) {
            templateData.reset_link = data.reset_link;
        }

        const html = await renderTemplate(template, templateData);

        await transport.sendMail({
            from: config.email.smtp.auth.user,
            to,
            subject,
            html,
        });

        return true;
    } catch (err) {
        logger.error(`❌ Email send failed: ${err.message}`);
        return false;
    }
};

module.exports = {
    sendTemplateEmail,
};
