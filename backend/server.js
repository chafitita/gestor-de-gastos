require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3001;

(async () => {
  try {
    await sequelize.sync({ alter: true }); // cambiar a { force: true } para reiniciar
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Error al conectar la base de datos", err);
  }
})();
