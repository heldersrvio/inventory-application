const express = require('express');
const router = express.Router();

const headphoneController = require('../controllers/headphoneController');

router.get('/', headphoneController.headphoneList);

router.get('/create', headphoneController.headphoneCreateGet);

router.post('/create', headphoneController.headphoneCreatePost);

router.get('/:id/delete', headphoneController.headphoneDeleteGet);

router.post('/:id/delete', headphoneController.headphoneDeletePost);

router.get('/:id/update', headphoneController.headphoneUpdateGet);

router.post('/:id/update', headphoneController.headphoneUpdatePost);

router.get('/:id', headphoneController.headphoneDetail);

module.exports = router;
