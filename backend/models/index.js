const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'db.sqlite'),
  logging: false,
});

const Transaction = require('./transaction')(sequelize);
const Category = require('./category')(sequelize);

Category.hasMany(Transaction);
Transaction.belongsTo(Category);

module.exports = {
  sequelize,
  Transaction,
  Category,
};
