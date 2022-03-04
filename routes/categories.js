const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/categoryController');

router.get('/', categoryController.categoryList);

router.get('/create', categoryController.categoryCreateGet);

router.post('/create', categoryController.categoryCreatePost);

router.get('/:id/delete', categoryController.categoryDeleteGet);

router.post('/:id/delete', categoryController.categoryDeletePost);

router.get('/:id/update', categoryController.categoryUpdateGet);

router.post('/:id/update', categoryController.categoryUpdatePost);

router.get('/:id', categoryController.categoryDetail);

module.exports = router;
