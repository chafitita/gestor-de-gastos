const Gasto = require('../models/gasto');

exports.getAllGastos = async (req, res) => {
  const gastos = await Gasto.findAll();
  res.json(gastos);
};

exports.getGastoById = async (req, res) => {
  const gasto = await Gasto.findByPk(req.params.id);
  if (gasto) res.json(gasto);
  else res.status(404).json({ error: 'Gasto no encontrado' });
};

exports.createGasto = async (req, res) => {
  const gasto = await Gasto.create(req.body);
  res.status(201).json(gasto);
};

exports.updateGasto = async (req, res) => {
  const gasto = await Gasto.findByPk(req.params.id);
  if (!gasto) return res.status(404).json({ error: 'Gasto no encontrado' });

  await gasto.update(req.body);
  res.json(gasto);
};

exports.deleteGasto = async (req, res) => {
  const rowsDeleted = await Gasto.destroy({ where: { id: req.params.id } });
  if (rowsDeleted) res.sendStatus(204);
  else res.status(404).json({ error: 'Gasto no encontrado' });
};
