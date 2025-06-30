const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const gastoRoutes = require('./routes/gastos');
const customCategoriesRoutes = require('./routes/customCategories');
const baseCategoriesRoutes = require('./routes/baseCategories');


const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:9002',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // solo si necesitás enviar cookies o headers auth personalizados
}));

app.use('/api/gastos', gastoRoutes);
app.use('/api/categorias/custom', customCategoriesRoutes);
app.use('/api/categorias/base', baseCategoriesRoutes);

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.sync({force: true}); // crea tablas si no existen
    app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
  } catch (err) {
    console.error('Error al iniciar la app:', err);
  }
})();
