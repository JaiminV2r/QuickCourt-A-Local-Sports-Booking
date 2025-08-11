const { v2: cloudinary } = require('cloudinary');
const streamifier = require('streamifier');
const config = require('../config/config');

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
  secure: config.cloudinary.secure
});

/** build a Cloudinary public_id from a simple name + logical type */
const publicIdFromName = (type, name) => {
  // store ONLY `name` in DB, never folder/extension
  // url/public_id will be like: quickcourt/{type}/{name}
  const folder = `${config.cloudinary.base_folder}/${type}`;
  return `${folder}/${name}`;
};

/** get a delivery URL using just the name stored in DB */
const urlFromName = (type, name, opts = {}) => {
  if (!name) return null;
  const publicId = publicIdFromName(type, name);
  // default: auto format/quality, DPR-aware
  const transformation = opts.transformation || [
    { fetch_format: 'auto', quality: 'auto' },
    ...(opts.w || opts.h ? [{ crop: 'fill', gravity: 'auto', width: opts.w, height: opts.h }] : [])
  ];
  return cloudinary.url(publicId, { secure: true, transformation });
};

/** Upload buffer (image/webp/png/jpg) — returns { public_id, secure_url, format, bytes } */
const cldUploadBuffer = (buffer, {
  type = 'misc',       // logical folder: 'venue' | 'court' | 'avatar' | ...
  public_id,           // if you want to set a fixed name; otherwise Cloudinary generates one
  overwrite = true,
  resource_type = 'image',
  use_filename = false,
  unique_filename = true
} = {}) => {
  const uploadOpts = {
    folder: `${config.cloudinary.base_folder}/${type}`,
    public_id,
    overwrite,
    resource_type,
    use_filename,
    unique_filename,
    // Default delivery optimization
    transformation: [{ fetch_format: 'auto', quality: 'auto' }]
  };

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(uploadOpts, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

/** Upload by local/temporary file path (if you use multer-disk, etc.) */
const cldUploadFile = async (filePath, { type = 'misc', public_id, overwrite = true, resource_type = 'image' } = {}) =>
  cloudinary.uploader.upload(filePath, {
    folder: `${config.cloudinary.base_folder}/${type}`,
    public_id,
    overwrite,
    resource_type,
    transformation: [{ fetch_format: 'auto', quality: 'auto' }]
  });

/** Delete by simple DB name + type */
const cldDeleteByName = async (type, name) => {
  const publicId = publicIdFromName(type, name);
  return cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
};

/** List images inside a logical folder (admin/search API) */
const cldListByType = async (type, { max_results = 50, next_cursor } = {}) =>
  cloudinary.search
    .expression(`folder:${config.cloudinary.base_folder}/${type}`)
    .max_results(max_results)
    .next_cursor(next_cursor)
    .execute();

module.exports = {
  publicIdFromName,
  urlFromName,
  cldUploadBuffer,
  cldUploadFile,
  cldDeleteByName,
  cldListByType
};
