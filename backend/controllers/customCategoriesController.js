const CustomCategory = require('../models/customCategory');

// GET /api/categorias/custom
exports.getCustomCategories = async (req, res) => {
  const categorias = await CustomCategory.findAll();
  res.json(categorias);
};

// POST /api/categorias/custom
exports.createCustomCategory = async (req, res) => {
  const { tipo, nombre } = req.body;

  if (!tipo || !nombre) {
    return res.status(400).json({ error: 'Tipo y nombre son requeridos' });
  }

  const categoriaExistente = await CustomCategory.findOne({ where: { tipo, nombre } });
  if (categoriaExistente) {
    return res.status(409).json({ error: 'La categoría ya existe' });
  }

  const nueva = await CustomCategory.create({ tipo, nombre });
  res.status(201).json(nueva);
};

// DELETE /api/categorias/custom/:id
exports.deleteCustomCategory = async (req, res) => {
  const eliminado = await CustomCategory.destroy({ where: { id: req.params.id } });
  if (eliminado) res.sendStatus(204);
  else res.status(404).json({ error: 'Categoría no encontrada' });
};
