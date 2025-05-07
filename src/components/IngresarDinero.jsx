import { useState } from 'react';
import { toast } from 'react-toastify';

const TransactionForm = ({ onAddTransaction }) => {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  
  const categories = {
    income: ['Salario', 'Freelance', 'Inversiones', 'Regalo', 'Otros ingresos'],
    expense: ['Comida', 'Transporte', 'Vivienda', 'Entretenimiento', 'Salud', 'Educación', 'Otros gastos']
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!amount || isNaN(amount) || amount <= 0) {
      toast.warn('Por favor ingresa un monto válido (mayor a 0)', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      return;
    }
    
    if (!category) {
      toast.warn('Por favor selecciona una categoría', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      return;
    }
    
    const transaction = {
      id: Date.now(),
      amount: parseInt(amount),
      type,
      category,
      description,
      date: new Date().toISOString()
    };
    
    onAddTransaction(transaction);
    
    setAmount('');
    setCategory('');
    setDescription('');
  };

  return (
    <div className="transaction-form">
      <h2>Agregar Transacción</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Monto:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Ingrese el monto"
            min="1"
            step="1"
          />
        </div>
        
        <div className="form-group">
          <label>Tipo:</label>
          <div className="type-options">
            <label>
              <input
                type="radio"
                value="expense"
                checked={type === 'expense'}
                onChange={() => setType('expense')}
              />
              Gasto
            </label>
            <label>
              <input
                type="radio"
                value="income"
                checked={type === 'income'}
                onChange={() => setType('income')}
              />
              Ingreso
            </label>
          </div>
        </div>
        
        <div className="form-group">
          <label>Categoría:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Seleccione una categoría</option>
            {categories[type].map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Descripción (opcional):</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción breve"
            maxLength="50"
          />
        </div>
        
        <button type="submit">Agregar Transacción</button>
      </form>
    </div>
  );
};

export default TransactionForm;