const express = require('express');
const router = express.Router();
const controller = require('../controllers/categoryController');

router.get('/', controller.getCategories);
router.post('/', controller.createCategory);
router.put('/:id', controller.updateCategory); // Ruta nueva
router.delete('/:id', controller.deleteCategory); // Ruta nueva

module.exports = router;