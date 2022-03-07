const crypto = require('crypto');
const { body, validationResult } = require('express-validator');

const authenticationController = (() => {
	const authenticationGet = (req, res, _next) => {
		console.log(req.query.action);
		res.render('adminAuthentication', {
			action: req.query.action,
		});
	};

	const authenticationPost = [
		body('password', 'Incorrect password.')
			.trim()
			.equals(process.env['ADMIN_PASSWORD']),
		(req, res, _next) => {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				res.render('adminAuthentication', {
					action: req.query.action,
					errors: errors.array(),
				});
			} else {
				const sha256 = crypto.createHash('sha256');
				const hash = sha256.update(req.body.password).digest('base64');
				res.cookie('Hash', hash);
				res.redirect(decodeURI(req.query.action));
			}
		},
	];

	return {
		authenticationGet,
		authenticationPost,
	};
})();

module.exports = authenticationController;
