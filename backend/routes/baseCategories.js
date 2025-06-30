const express = require('express');
const router = express.Router();

const incomeCategories = [
  "Sueldo", "Inversiones", "Ventas", "Becas Educativas", "Reembolsos"
];

const expenseCategories = [
  "Vivienda", "Transporte", "Salud", "Educación", "Servicios", "Impuestos", "Entretenimiento"
];

router.get('/', (req, res) => {
  res.json({ income: incomeCategories, expense: expenseCategories });
});

module.exports = router;
