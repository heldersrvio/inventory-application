const express = require('express');
const router = express.Router();

const brandController = require('../controllers/brandController');

router.get('/', brandController.brandList);

router.get('/create', brandController.brandCreateGet);

router.post('/create', brandController.brandCreatePost);

router.get('/:id/delete', brandController.brandDeleteGet);

router.post('/:id/delete', brandController.brandDeletePost);

router.get('/:id/update', brandController.brandUpdateGet);

router.post('/:id/update', brandController.brandUpdatePost);

router.get('/:id', brandController.brandDetail);

module.exports = router;
