const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const genericUrl = 'https://i.imgur.com/Gd3oRjA.png';

const retrieveImage = (image) => {
	return image === null || image === undefined ? genericUrl : image;
};

const HeadphoneSchema = new Schema({
	name: { type: String, required: true },
	description: { type: String },
	category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
	price: { type: Number, required: true },
	number_in_stock: { type: Number, required: true },
	brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
	is_wireless: { type: Boolean, required: true },
	is_noise_canceling: { type: Boolean, required: true },
	image: { type: String, get: retrieveImage },
});

HeadphoneSchema.virtual('url').get(function () {
	return '/headphones/' + this._id;
});

module.exports = mongoose.model('Headphone', HeadphoneSchema);
