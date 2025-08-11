// backend/src/models/sport.model.js
const { Schema, model, models } = require('mongoose');
const { urlFromName } = require('../utils/cloudnairy.utils');
const { FILE_FOLDERS } = require('../helper/constant.helper');
const { toJSON , paginate} = require('./plugins');
const SportSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, unique: true, index: true },
    // store ONLY the Cloudinary image name (no folder/extension)
    imageName: { type: String } 
  },
  { timestamps: true }
);

SportSchema.plugin(toJSON);
SportSchema.plugin(paginate);

// Add Cloudinary URL at response time
SportSchema.set('toJSON', {
  transform: (_, ret) => {
    ret.imageUrl = ret.imageName
      ? urlFromName(FILE_FOLDERS.SPORT, ret.imageName, { w: 512, h: 512 })
      : null;
    return ret;
  }
});

module.exports = models.Sport || model('Sport', SportSchema);
