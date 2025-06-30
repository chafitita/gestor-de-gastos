const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CustomCategory = sequelize.define('CustomCategory', {
  tipo: {
    type: DataTypes.ENUM('income', 'expense'),
    allowNull: false,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = CustomCategory;
