const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const genericUrl = 'https://i.imgur.com/HscfdWS.png';

const retrieveLogo = (logo) => {
	return logo === null || logo === undefined ? genericUrl : logo;
};

const BrandSchema = new Schema({
	name: { type: String, required: true },
	logo_image: { type: String, get: retrieveLogo },
});

BrandSchema.virtual('url').get(function () {
	return '/brands/' + this._id;
});

module.exports = mongoose.model('Brand', BrandSchema);
