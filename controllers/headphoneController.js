const async = require('async');
const Headphone = require('../models/headphone');
const Category = require('../models/category');
const Brand = require('../models/brand');
const { body, validationResult } = require('express-validator');

const headphoneController = (() => {
	const headphoneList = (_req, res, next) => {
		Headphone.find()
			.sort({ name: 1 })
			.populate('brand')
			.populate('category')
			.exec((err, listHeadphones) => {
				if (err !== null) {
					return next(err);
				}
				res.render('headphoneList', {
					title: 'Headphone List',
					headphoneList: listHeadphones,
				});
			});
	};

	const headphoneDetail = (req, res, next) => {
		Headphone.findById(req.params.id)
			.populate('brand')
			.populate('category')
			.exec((err, headphone) => {
				if (err !== null) {
					return next(err);
				}
				if (headphone === null) {
					const err = new Error('Headphone not found');
					err.status = 404;
					return next(err);
				}
				res.render('headphoneDetail', {
					title: headphone.name,
					headphone,
				});
			});
	};

	const headphoneCreateGet = (req, res, next) => {
		async.parallel(
			{
				categories: (callback) => {
					Category.find(callback);
				},
				brands: (callback) => {
					Brand.find(callback);
				},
			},
			(err, results) => {
				if (err !== null) {
					return next(err);
				}
				res.render('headphoneForm', {
					title: 'Create Headphone',
					categories: results.categories,
					brands: results.brands,
				});
			},
		);
	};

	const headphoneCreatePost = [
		(req, _res, next) => {
			if (req.body.is_wireless === undefined) {
				req.body.is_wireless = false;
			} else {
				req.body.is_wireless = true;
			}
			if (req.body.is_noise_canceling === undefined) {
				req.body.is_noise_canceling = false;
			} else {
				req.body.is_noise_canceling = true;
			}
			next();
		},
		body('name', 'Headphone name required.')
			.trim()
			.isLength({ min: 1 })
			.escape(),
		body('category', 'Category must not be empty.')
			.trim()
			.isLength({ min: 1 })
			.escape(),
		body('price', 'Invalid price.').isFloat({ min: 0 }),
		body('number_in_stock', 'Invalid number in stock.').isInt(),
		body('brand', 'Brand must not be empty.')
			.trim()
			.isLength({ min: 1 })
			.escape(),

		(req, res, next) => {
			const errors = validationResult(req);
			const headphone = new Headphone({
				name: req.body.name,
				description: req.body.description,
				category: req.body.category,
				price: req.body.price,
				number_in_stock: req.body.number_in_stock,
				brand: req.body.brand,
				is_wireless: req.body.is_wireless,
				is_noise_canceling: req.body.is_noise_canceling,
			});
			if (!errors.isEmpty()) {
				async.parallel(
					{
						categories: (callback) => {
							Category.find(callback);
						},
						brands: (callback) => {
							Brand.find(callback);
						},
					},
					(err, results) => {
						if (err !== null) {
							return next(err);
						}
						res.render('headphoneForm', {
							title: 'Create Headphone',
							categories: results.categories,
							brands: results.brands,
							headphone,
							errors: errors.array(),
						});
					},
				);
			} else {
				headphone.save((err) => {
					if (err !== null) {
						return next(err);
					}
					res.redirect(headphone.url);
				});
			}
		},
	];

	const headphoneDeleteGet = (req, res, next) => {
		Headphone.find({ headphone: req.params.id }).exec((err, headphone) => {
			if (err !== null) {
				return next(err);
			}
			if (headphone === null) {
				res.redirect('/headphones');
			}
			res.render('headphoneDelete', {
				title: 'Delete Headphone',
				headphone: headphone,
			});
		});
	};

	const headphoneDeletePost = (req, res, next) => {
		Headphone.findByIdAndDelete(req.body.headphoneId, (err) => {
			if (err !== null) {
				return next(err);
			}
			res.redirect('/headphones');
		});
	};

	const headphoneUpdateGet = (req, res, next) => {
		async.parallel(
			{
				headphone: (callback) => {
					Headphone.findById(req.params.id).exec(callback);
				},
				categories: (callback) => {
					Category.find(callback);
				},
				brands: (callback) => {
					Brand.find(callback);
				},
			},
			(err, results) => {
				if (err !== null) {
					return next(err);
				}
				if (results.headphone === null) {
					const err = new Error('Headphone not found');
					err.status = 404;
					return next(err);
				}
				res.render('headphoneForm', {
					title: 'Update Headphone',
					categories: results.categories,
					brands: results.brands,
					headphone: results.headphone,
				});
			},
		);
	};

	const headphoneUpdatePost = [
		(req, _res, next) => {
			if (req.body.is_wireless === undefined) {
				req.body.is_wireless = false;
			} else {
				req.body.is_wireless = true;
			}
			if (req.body.is_noise_canceling === undefined) {
				req.body.is_noise_canceling = false;
			} else {
				req.body.is_noise_canceling = true;
			}
			next();
		},
		body('name', 'Headphone name required.')
			.trim()
			.isLength({ min: 1 })
			.escape(),
		body('category', 'Category must not be empty.')
			.trim()
			.isLength({ min: 1 })
			.escape(),
		body('price', 'Invalid price.').isFloat({ min: 0 }),
		body('number_in_stock', 'Invalid number in stock.').isInt(),
		body('brand', 'Brand must not be empty.')
			.trim()
			.isLength({ min: 1 })
			.escape(),

		(req, res, next) => {
			const errors = validationResult(req);
			const headphone = new Headphone({
				name: req.body.name,
				description: req.body.description,
				category: req.body.category,
				price: req.body.price,
				number_in_stock: req.body.number_in_stock,
				brand: req.body.brand,
				is_wireless: req.body.is_wireless,
				is_noise_canceling: req.body.is_noise_canceling,
				_id: req.params.id,
			});
			if (!errors.isEmpty()) {
				async.parallel(
					{
						categories: (callback) => {
							Category.find(callback);
						},
						brands: (callback) => {
							Brand.find(callback);
						},
					},
					(err, results) => {
						if (err !== null) {
							return next(err);
						}
						res.render('headphoneForm', {
							title: 'Update Headphone',
							categories: results.categories,
							brands: results.brands,
							headphone,
							errors: errors.array(),
						});
					},
				);
			} else {
				headphone.findByIdAndUpdate(
					req.params.id,
					headphone,
					{},
					(err, updatedHeadphone) => {
						if (err !== null) {
							return next(err);
						}
						res.redirect(updatedHeadphone.url);
					},
				);
			}
		},
	];

	return {
		headphoneList,
		headphoneDetail,
		headphoneCreateGet,
		headphoneCreatePost,
		headphoneDeleteGet,
		headphoneDeletePost,
		headphoneUpdateGet,
		headphoneUpdatePost,
	};
})();

module.exports = headphoneController;
