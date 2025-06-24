const express = require('express');
const router = express.Router();
const controller = require('../controllers/categoryController');

router.get('/', controller.getCategories);
router.post('/', controller.createCategory);

module.exports = router;
