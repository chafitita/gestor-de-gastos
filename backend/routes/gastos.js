const express = require('express');
const router = express.Router();
const controller = require('../controllers/gastosController');

router.get('/', controller.getAllGastos);
router.get('/:id', controller.getGastoById);
router.post('/', controller.createGasto);
router.put('/:id', controller.updateGasto);
router.delete('/:id', controller.deleteGasto);

module.exports = router;
