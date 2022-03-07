const express = require('express');
const router = express.Router();

router.get('/', (req, res, _next) => {
	res.redirect('/headphones');
});

module.exports = router;
