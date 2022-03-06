const async = require('async');
const Category = require('../models/category');
const Headphone = require('../models/headphone');
const { body, validationResult } = require('express-validator');

const categoryController = (() => {
	const categoryList = (_req, res, next) => {
		Category.find()
			.sort({ name: 1 })
			.exec((err, listCategories) => {
				if (err !== null) {
					return next(err);
				}
				res.render('categoryList', {
					title: 'Category List',
					categoryList: listCategories,
				});
			});
	};

	const categoryDetail = (req, res, next) => {
		async.parallel(
			{
				category: (callback) => {
					Category.findById(req.params.id).exec(callback);
				},
				categoryHeadphones: (callback) => {
					Headphone.find({ category: req.params.id }).exec(callback);
				},
			},
			(err, results) => {
				if (err !== null) {
					return next(err);
				}
				if (results.category === null) {
					const err = new Error('Category not found');
					err.status = 404;
					return next(err);
				}
				res.render('categoryDetail', {
					title: 'Category Detail',
					category: results.category,
					categoryHeadphones: results.categoryHeadphones,
				});
			},
		);
	};

	const categoryCreateGet = (req, res, _next) => {
		res.render('categoryForm', { title: 'Create Category' });
	};

	const categoryCreatePost = [
		body('name', 'Category name required.')
			.trim()
			.isLength({ min: 1 })
			.escape(),
		(req, res, next) => {
			const errors = validationResult(req);
			const category = new Category({
				name: req.body.name,
				description: req.body.description,
			});
			if (!errors.isEmpty()) {
				res.render('categoryForm', {
					title: 'Create Category',
					category,
					errors: errors.array(),
				});
			} else {
				Category.findOne({ name: req.body.name }).exec((err, foundCategory) => {
					if (err !== null) {
						return next(err);
					}
					if (foundCategory !== null && foundCategory !== undefined) {
						res.redirect(foundCategory.url);
					} else {
						category.save((err) => {
							if (err !== null) {
								return next(err);
							}
							res.redirect(category.url);
						});
					}
				});
			}
		},
	];

	const categoryDeleteGet = (req, res, next) => {
		async.parallel(
			{
				category: (callback) => {
					Category.findById(req.params.id).exec(callback);
				},
				categoryHeadphones: (callback) => {
					Headphone.find({ category: req.params.id }).exec(callback);
				},
			},
			(err, results) => {
				if (err !== null) {
					return next(err);
				}
				if (results.category === null) {
					res.redirect('/categories');
				}
				res.render('categoryDelete', {
					title: 'Delete Category',
					category: results.category,
					categoryHeadphones: results.categoryHeadphones,
				});
			},
		);
	};

	const categoryDeletePost = (req, res, next) => {
		async.parallel(
			{
				category: (callback) => {
					Category.findById(req.params.id).exec(callback);
				},
				categoryHeadphones: (callback) => {
					Headphone.find({ category: req.params.id }).exec(callback);
				},
			},
			(err, results) => {
				if (err !== null) {
					return next(err);
				}
				if (results.categoryHeadphones.length > 0) {
					res.render('categoryDelete', {
						title: 'Category Delete',
						category: results.category,
						categoryHeadphones: results.categoryHeadphones,
					});
				} else {
					Category.findByIdAndDelete(req.body.categoryId, (err) => {
						if (err !== null) {
							return next(err);
						}
						res.redirect('/categories');
					});
				}
			},
		);
	};

	const categoryUpdateGet = (req, res, next) => {
		async.parallel(
			{
				category: (callback) => {
					Category.findById(req.params.id).exec(callback);
				},
				categoryHeadphones: (callback) => {
					Headphone.find({ category: req.params.id }).exec(callback);
				},
			},
			(err, results) => {
				if (err !== null) {
					return next(err);
				}
				if (results.category === null) {
					const err = new Error('Category not found');
					err.status = 404;
					return next(err);
				}
				res.render('categoryForm', {
					title: 'Update Category',
					category: results.category,
					categoryHeadphones: results.categoryHeadphones,
				});
			},
		);
	};

	const categoryUpdatePost = [
		body('name', 'Category name required.')
			.trim()
			.isLength({ min: 1 })
			.escape(),
		(req, res, next) => {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				res.render('categoryForm', {
					title: 'Update Category',
					category: req.body,
					errors: errors.array(),
				});
			} else {
				const category = new Category({
					name: req.body.name,
					description: req.body.description,
					_id: req.params.id,
				});
				Category.findByIdAndUpdate(
					req.params.id,
					category,
					{},
					(err, updatedCategory) => {
						if (err !== null) {
							return next(err);
						}
						res.redirect(updatedCategory.url);
					},
				);
			}
		},
	];

	return {
		categoryList,
		categoryDetail,
		categoryCreateGet,
		categoryCreatePost,
		categoryDeleteGet,
		categoryDeletePost,
		categoryUpdateGet,
		categoryUpdatePost,
	};
})();

module.exports = categoryController;
