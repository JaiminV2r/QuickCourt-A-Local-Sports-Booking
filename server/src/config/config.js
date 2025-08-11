const dotenv = require('dotenv')
const path = require('path')
const Joi = require('joi')

dotenv.config({ path: path.join(__dirname, '../../.env') })

const envVarsSchema = Joi.object()
    .keys({
        PORT: Joi.number().default(3000),
        MONGODB_URL: Joi.string().required().description('Mongo DB url'),
        JWT_SECRET: Joi.string().required().description('JWT secret key'),
        JWT_ACCESS_EXPIRATION_YEARS: Joi.number()
            .default(30)
            .description('minutes after which access tokens expire'),
        JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
            .default(30)
            .description('days after which refresh tokens expire'),
        OTP_EXPIRATION_MINUTES: Joi.number().default(10).description('minutes after which otp expires'),
        SMTP_HOST: Joi.string().description('server that will send the emails'),
        SMTP_PORT: Joi.number().description('port to connect to the email server'),
        SMTP_USERNAME: Joi.string().description('username for email server'),
        SMTP_PASSWORD: Joi.string().description('password for email server'),
        EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
        BASE_URL: Joi.string().required().description('Base url'),
        CLOUDINARY_CLOUD_NAME: Joi.string().required().description('Cloudinary cloud name'),
        CLOUDINARY_API_KEY: Joi.string().required().description('Cloudinary API key'),
        CLOUDINARY_API_SECRET: Joi.string().required().description('Cloudinary API secret'),
        CLOUDINARY_SECURE: Joi.boolean().default(true).description('Use secure URLs for Cloudinary'),
        CLOUDINARY_BASE_FOLDER: Joi.string().default('quickcourt').description('Base folder in Cloudinary'),
    })
    .unknown()

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env)

if (error) {
    throw new Error(`Config validation error: ${error.message}`)
}

module.exports = {
    port: envVars.PORT,
    mongoose: {
        url: envVars.MONGODB_URL,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    },
    jwt: {
        secret: envVars.JWT_SECRET,
        accessExpirationYear: envVars.JWT_ACCESS_EXPIRATION_YEARS,
        refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
        otpExpirationMinutes: envVars.OTP_EXPIRATION_MINUTES,
    },
    email: {
        smtp: {
            host: envVars.SMTP_HOST,
            port: envVars.SMTP_PORT,
            auth: {
                user: envVars.SMTP_USERNAME,
                pass: envVars.SMTP_PASSWORD,
            },
        },
        from: envVars.EMAIL_FROM,
    },
    base_url: envVars.BASE_URL,
    front_url: envVars.FRONT_URL,
    cloudinary: {
        cloud_name: envVars.CLOUDINARY_CLOUD_NAME,
        api_key: envVars.CLOUDINARY_API_KEY,
        api_secret: envVars.CLOUDINARY_API_SECRET,
        secure: envVars.CLOUDINARY_SECURE,
        base_folder: envVars.CLOUDINARY_BASE_FOLDER,
    },
}
