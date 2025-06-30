const express = require('express');
const router = express.Router();
const controller = require('../controllers/customCategoriesController');

router.get('/', controller.getCustomCategories);
router.post('/', controller.createCustomCategory);
router.delete('/:id', controller.deleteCustomCategory);

module.exports = router;
