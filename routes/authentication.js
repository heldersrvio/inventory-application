const express = require('express');
const router = express.Router();

const authenticationController = require('../controllers/authenticationController');

router.get('/', authenticationController.authenticationGet);

router.post('/', authenticationController.authenticationPost);

module.exports = router;
