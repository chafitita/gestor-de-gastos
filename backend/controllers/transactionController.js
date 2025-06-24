const { Transaction, Category } = require('../models');

exports.getTransactions = async (req, res) => {
  const transactions = await Transaction.findAll({ include: Category });
  res.json(transactions);
};

exports.createTransaction = async (req, res) => {
    const category = await Category.findByPk(categoryId);
if (!category) {
  return res.status(400).json({ error: 'Categoría no encontrada' });
}

    console.log('Datos recibidos:', req.body);
  const { amount, type, categoryId, description, date } = req.body;
  try {
    const transaction = await Transaction.create({
      amount,
      type,
      description,
      date,
      CategoryId: categoryId,
    });
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  const { id } = req.params;
  try {
    await Transaction.destroy({ where: { id } });
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
