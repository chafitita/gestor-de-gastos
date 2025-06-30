import { useState } from 'react';
import { toast } from 'react-toastify';

const TransactionForm = ({ onAddTransaction, customCategories, onAddCustomCategory }) => {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [showCustomCategoryInput, setShowCustomCategoryInput] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');

  const categories = {
    income: ['Salario', 'Freelance', 'Inversiones', 'Regalo', 'Otros ingresos', ...customCategories.income],
    expense: ['Comida', 'Transporte', 'Vivienda', 'Entretenimiento', 'Salud', 'Educación', 'Otros gastos', ...customCategories.expense],
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || isNaN(amount) || amount <= 0) {
      toast.warn('Por favor ingresa un monto válido (mayor a 0)', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!category) {
      toast.warn('Por favor selecciona una categoría', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const newTransaction = {
      amount: parseInt(amount),
      type,
      category,
      description,
      date: new Date().toISOString(),
    };

    try {
      const res = await fetch("http://localhost:3000/api/gastos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTransaction),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al agregar transacción");
      }

      const savedTransaction = await res.json();
      onAddTransaction(savedTransaction); // actualiza el estado en App.jsx

      toast.success(
        `${type === 'expense' ? 'Gasto' : 'Ingreso'} agregado correctamente`,
        { position: "top-right", autoClose: 3000 }
      );

      setAmount('');
      setCategory('');
      setDescription('');
      setShowCustomCategoryInput(false);
      setCustomCategoryName('');
    } catch (error) {
      toast.error(`Error: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleAddCustomCategory = async () => {
    const wasAdded = await onAddCustomCategory(type, customCategoryName);
    if (wasAdded) {
      setCategory(customCategoryName);
      setCustomCategoryName('');
      setShowCustomCategoryInput(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="transaction-form">
      <h2>Registrar Transacción</h2>
      
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="expense">Gasto</option>
        <option value="income">Ingreso</option>
      </select>

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Selecciona una categoría</option>
        {categories[type].map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <button type="button" onClick={() => setShowCustomCategoryInput(!showCustomCategoryInput)}>
        {showCustomCategoryInput ? "Cancelar" : "Agregar Categoría Personalizada"}
      </button>

      {showCustomCategoryInput && (
        <div className="custom-category-input">
          <input
            type="text"
            value={customCategoryName}
            onChange={(e) => setCustomCategoryName(e.target.value)}
            placeholder="Nueva categoría"
          />
          <button type="button" onClick={handleAddCustomCategory}>
            Agregar
          </button>
        </div>
      )}

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Monto"
      />

      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descripción (opcional)"
      />

      <button type="submit">Agregar Transacción</button>
    </form>
  );
};

export default TransactionForm;
