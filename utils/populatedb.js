#! /usr/bin/env node

// Get arguments passed on command line
const userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
const async = require('async');
const Headphone = require('./models/headphone');
const Category = require('./models/category');
const Brand = require('./models/brand');

const mongoose = require('mongoose');
const mongoDB = userArgs[0];
console.log(mongoDB);
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const headphones = [];
const categories = [];
const brands = [];

const categoryCreate = (name, description, cb) => {
	const category = new Category({
		name,
		description,
	});
	category.save((err) => {
		if (err) {
			cb(err, null);
		} else {
			console.log('New Category: ' + category);
			categories.push(category);
			cb(null, category);
		}
	});
};

const brandCreate = (name, logo_image, cb) => {
	const brandDetail = {
		name,
	};
	if (logo_image !== null) {
		brandDetail.logo_image = logo_image;
	}
	const brand = new Brand(brandDetail);
	brand.save((err) => {
		if (err) {
			cb(err, null);
		} else {
			console.log('New Brand: ' + brand);
			brands.push(brand);
			cb(null, brand);
		}
	});
};

const headphoneCreate = (
	name,
	description,
	category,
	price,
	number_in_stock,
	brand,
	is_wireless,
	is_noise_canceling,
	image,
	cb
) => {
	const headphoneDetail = {
		name,
		category,
		price,
		number_in_stock,
		brand,
		is_wireless,
		is_noise_canceling,
	};
	if (description !== null) {
		headphoneDetail.description = description;
	}
	if (image !== null) {
		headphoneDetail.image = image;
	}
	const headphone = new Headphone(headphoneDetail);
	headphone.save((err) => {
		if (err) {
			cb(err, null);
		} else {
			console.log('New Headphone: ' + headphone);
			headphones.push(headphone);
			cb(null, headphone);
		}
	});
};

const findSomething = (cb) => {
	async.series(
		[
			(callback) => {
				const x = Headphone.find(callback);
				console.log(x);
			},
		],
		cb
	);
};

const createCategoriesAndBrands = (cb) => {
	async.series(
		[
			(callback) => {
				categoryCreate(
					'Over-Ear',
					'Earpads big enough to fit your entire year and have a headband that connects two earcups.',
					callback
				);
			},
			(callback) => {
				categoryCreate(
					'On-Ear',
					'Similar to Over-Ear headphones, but with smaller earpads that rest on your earlobes.',
					callback
				);
			},
			(callback) => {
				categoryCreate(
					'Earbuds',
					'Portable, small, with a variety of shapes and sizes.',
					callback
				);
			},
			(callback) => {
				categoryCreate(
					'Earphones',
					'Small like the earbuds, but sit in front of the ear canal and rest on your earlobes.',
					callback
				);
			},
			(callback) => {
				categoryCreate(
					'Bone Conduction',
					'Use bone conducting technology to transmit sound through your cheekbones.',
					callback
				);
			},
			(callback) => {
				categoryCreate('Closed-Back', 'Fully closed ear cups.', callback);
			},
			(callback) => {
				categoryCreate('Open-Back', 'Semi or fully open earcups.', callback);
			},
			(callback) => {
				brandCreate('Sony', 'https://i.imgur.com/UfHKGwS.jpg', callback);
			},
			(callback) => {
				brandCreate('JBL', 'https://i.imgur.com/RlTGO60.png', callback);
			},
			(callback) => {
				brandCreate('Bose', 'https://i.imgur.com/dEfghnM.jpg', callback);
			},
			(callback) => {
				brandCreate('Beats', 'https://i.imgur.com/wU8hiMA.jpg', callback);
			},
			(callback) => {
				brandCreate('Apple', 'https://i.imgur.com/nbNUBdj.jpg', callback);
			},
		],
		cb
	);
};

const createHeadphones = (cb) => {
	async.parallel(
		[
			(callback) => {
				headphoneCreate(
					'Sony ZX Series Wired On-Ear Headphones',
					'Lightweight 1.38 in neodymium dynamic drivers deliver a punchy, rhythmic response to even the most demanding tracks.',
					categories[1],
					9.99,
					55,
					brands[0],
					false,
					false,
					'https://i.imgur.com/yWEVXI2.jpg',
					callback
				);
			},
			(callback) => {
				headphoneCreate(
					'JBL Tune 510BT: Wireless On-Ear Headphones with Purebass Sound',
					'The Tune 510BT wireless headphones feature renowned JBL Pure Bass sound, which can be found in the most famous venues all around the world.',
					categories[1],
					29.95,
					21,
					brands[1],
					true,
					false,
					'https://i.imgur.com/zrUJW82.png',
					callback
				);
			},
			(callback) => {
				headphoneCreate(
					'Sony WH-1000XM4 Wireless Industry Leading Noise Canceling Overhead Headphones with Mic for Phone-Call and Alexa Voice Control',
					'Industry-leading noise canceling with Dual Noise Sensor technology.',
					categories[0],
					278.0,
					100,
					brands[0],
					true,
					true,
					'https://i.imgur.com/Ul7PWGU.png',
					callback
				);
			},
			(callback) => {
				headphoneCreate(
					'Bose QuietComfort 35 II Noise Cancelling Bluetooth Headphones',
					'Three levels of world-class noise cancellation for better listening experience in any environment.',
					categories[0],
					299.0,
					45,
					brands[2],
					true,
					true,
					'https://i.imgur.com/jiRNTum.jpg',
					callback
				);
			},
			(callback) => {
				headphoneCreate(
					'Bose QuietComfort Noise Cancelling Earbuds - True Wireless Bluetooth Earphones, Soapstone',
					"Noise cancelling earbuds — Engineered with the world's most effective noise cancelling. Bose controllable noise cancellation and full Transparency Mode allow you to eliminate distractions, let your surroundings in, or a little bit of each.",
					categories[2],
					219.0,
					210,
					brands[2],
					true,
					true,
					'https://i.imgur.com/ubCFBzQ.jpg',
					callback
				);
			},
			(callback) => {
				headphoneCreate(
					'Apple EarPods with Lightning Connector',
					'Unlike traditional, circular earbuds, the design of the EarPods is defined by the geometry of the ear which makes them more comfortable for more people than any other earbud-style headphones.',
					categories[3],
					19.0,
					60,
					brands[4],
					false,
					false,
					'https://i.imgur.com/RGhY073.png',
					callback
				);
			},
			(callback) => {
				headphoneCreate(
					'Beats Studio3 Wireless Noise Cancelling Over-Ear Headphones - Apple W1 Headphone Chip, Class 1 Bluetooth, 22 Hours of Listening Time, Built-in Microphone',
					'High-performance wireless noise cancelling headphones.',
					categories[0],
					199.99,
					3,
					brands[3],
					true,
					true,
					'https://i.imgur.com/M3YIHPR.jpg',
					callback
				);
			},
		],
		cb
	);
};

async.series(
	[findSomething, createCategoriesAndBrands, createHeadphones],
	(err, _results) => {
		if (err) {
			console.log('FINAL ERR: ' + err);
		} else {
			console.log('Headphones: ' + headphones);
		}
		mongoose.connection.close();
	}
);
