const crypto = require('crypto');
const url = require('url');
const async = require('async');
const multer = require('multer');
const Brand = require('../models/brand');
const Headphone = require('../models/headphone');
const { body, validationResult } = require('express-validator');

const upload = multer({ dest: 'public/images/' });

const brandController = (() => {
	const verifyHash = (passwordHash) => {
		const sha256 = crypto.createHash('sha256');
		const hash = sha256.update(process.env['ADMIN_PASSWORD']).digest('base64');
		return passwordHash === hash;
	};

	const brandList = (_req, res, next) => {
		Brand.find()
			.sort({ name: 1 })
			.exec((err, listBrands) => {
				if (err !== null) {
					return next(err);
				}
				res.render('brandList', {
					title: 'Brand List',
					brandList: listBrands,
				});
			});
	};

	const brandDetail = (req, res, next) => {
		async.parallel(
			{
				brand: (callback) => {
					Brand.findById(req.params.id).exec(callback);
				},
				brandHeadphones: (callback) => {
					Headphone.find({ brand: req.params.id }).exec(callback);
				},
			},
			(err, results) => {
				if (err !== null) {
					return next(err);
				}
				if (results.brand === null) {
					const err = new Error('Brand not found');
					err.status = 404;
					return next(err);
				}
				res.render('brandDetail', {
					title: 'Brand Detail',
					brand: results.brand,
					brandHeadphones: results.brandHeadphones,
				});
			},
		);
	};

	const brandCreateGet = (req, res, _next) => {
		res.render('brandForm', { title: 'Create Brand' });
	};

	const brandCreatePost = [
		upload.single('logo_image'),
		body('name', 'Brand name required.').trim().isLength({ min: 1 }).escape(),
		(req, res, next) => {
			const errors = validationResult(req);
			const brand = new Brand({ name: req.body.name });
			if (req.file !== null && req.file !== undefined) {
				brand.logo_image = `/images/${req.file.filename}`;
			}
			if (!errors.isEmpty()) {
				res.render('brandForm', {
					title: 'Create Brand',
					brand,
					errors: errors.array(),
				});
			} else {
				Brand.findOne({ name: req.body.name }).exec((err, foundBrand) => {
					if (err !== null) {
						return next(err);
					}
					if (foundBrand !== null && foundBrand !== undefined) {
						res.redirect(foundBrand.url);
					} else {
						brand.save((err) => {
							if (err !== null) {
								return next(err);
							}
							res.redirect(brand.url);
						});
					}
				});
			}
		},
	];

	const brandDeleteGet = (req, res, next) => {
		if (!verifyHash(req.cookies['Hash'])) {
			res.redirect(
				url.format({
					pathname: '/authentication',
					query: {
						action: req.originalUrl,
					},
				}),
			);
		} else {
			async.parallel(
				{
					brand: (callback) => {
						Brand.findById(req.params.id).exec(callback);
					},
					brandHeadphones: (callback) => {
						Headphone.find({ brand: req.params.id }).exec(callback);
					},
				},
				(err, results) => {
					if (err !== null) {
						return next(err);
					}
					if (results.brand === null) {
						res.redirect('/brands');
					}
					res.render('brandDelete', {
						title: 'Delete Brand',
						brand: results.brand,
						brandHeadphones: results.brandHeadphones,
					});
				},
			);
		}
	};

	const brandDeletePost = (req, res, next) => {
		async.parallel(
			{
				brand: (callback) => {
					Brand.findById(req.params.id).exec(callback);
				},
				brandHeadphones: (callback) => {
					Headphone.find({ brand: req.params.id }).exec(callback);
				},
			},
			(err, results) => {
				if (err !== null) {
					return next(err);
				}
				if (results.brandHeadphones.length > 0) {
					res.render('brandDelete', {
						title: 'Brand Delete',
						brand: results.brand,
						brandHeadphones: results.brandHeadphones,
					});
				} else {
					Brand.findByIdAndDelete(req.body.brandId, (err) => {
						if (err !== null) {
							return next(err);
						}
						res.redirect('/brands');
					});
				}
			},
		);
	};

	const brandUpdateGet = (req, res, next) => {
		if (!verifyHash(req.cookies['Hash'])) {
			res.redirect(
				url.format({
					pathname: '/authentication',
					query: {
						action: req.originalUrl,
					},
				}),
			);
		} else {
			async.parallel(
				{
					brand: (callback) => {
						Brand.findById(req.params.id).exec(callback);
					},
					brandHeadphones: (callback) => {
						Headphone.find({ brand: req.params.id }).exec(callback);
					},
				},
				(err, results) => {
					if (err !== null) {
						return next(err);
					}
					if (results.brand === null) {
						const err = new Error('Brand not found');
						err.status = 404;
						return next(err);
					}
					res.render('brandForm', {
						title: 'Update Brand',
						brand: results.brand,
						brandHeadphones: results.brandHeadphones,
					});
				},
			);
		}
	};

	const brandUpdatePost = [
		upload.single('logo_image'),
		body('name', 'Brand name required.').trim().isLength({ min: 1 }).escape(),
		(req, res, next) => {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				res.render('brandForm', {
					title: 'Update Brand',
					brand: req.body,
					errors: errors.array(),
				});
			} else {
				const brand = new Brand({ name: req.body.name, _id: req.params.id });
				if (req.file !== null && req.file !== undefined) {
					brand.logo_image = `/images/${req.file.filename}`;
				}
				Brand.findByIdAndUpdate(
					req.params.id,
					brand,
					{},
					(err, updatedBrand) => {
						if (err !== null) {
							return next(err);
						}
						res.redirect(updatedBrand.url);
					},
				);
			}
		},
	];

	return {
		brandList,
		brandDetail,
		brandCreateGet,
		brandCreatePost,
		brandDeleteGet,
		brandDeletePost,
		brandUpdateGet,
		brandUpdatePost,
	};
})();

module.exports = brandController;
