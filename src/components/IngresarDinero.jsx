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
    income: customCategories.income,
    expense: customCategories.expense
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || isNaN(amount) || amount <= 0) {
      toast.warn('Por favor ingresa un monto válido (mayor a 0)', {
        position: "top-right",
        autoClose: 3000
      });
      return;
    }

    if (!category) {
      toast.warn('Por favor selecciona una categoría', {
        position: "top-right",
        autoClose: 3000
      });
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/categories");
      const allCategories = await res.json();
      const selected = allCategories.find(cat => cat.name === category && cat.type === type);

      if (!selected) {
        toast.error("Categoría no encontrada en la base de datos");
        return;
      }

      const transaction = {
        amount: parseFloat(amount),
        type,
        categoryId: selected.id,
        description,
        date: new Date().toISOString()
      };

      onAddTransaction(transaction);

      setAmount('');
      setCategory('');
      setDescription('');
      setShowCustomCategoryInput(false);
      setCustomCategoryName('');
    } catch (error) {
      console.error("Error al preparar transacción:", error);
      toast.error("Ocurrió un error al enviar la transacción");
    }
  };

  const handleAddCustomCategory = async () => {
    const ok = await onAddCustomCategory(type, customCategoryName);
    if (ok) {
      setCategory(customCategoryName);
      setCustomCategoryName('');
      setShowCustomCategoryInput(false);
    }
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
            step="0.01"
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
                onChange={() => {
                  setType('expense');
                  setCategory('');
                  setShowCustomCategoryInput(false);
                }}
              />
              Gasto
            </label>
            <label>
              <input
                type="radio"
                value="income"
                checked={type === 'income'}
                onChange={() => {
                  setType('income');
                  setCategory('');
                  setShowCustomCategoryInput(false);
                }}
              />
              Ingreso
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Categoría:</label>
          {!showCustomCategoryInput ? (
            <>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Seleccione una categoría</option>
                {categories[type].map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="new">-- Agregar nueva categoría --</option>
              </select>

              {category === 'new' && (
                <button
                  type="button"
                  onClick={() => setShowCustomCategoryInput(true)}
                  className="add-category-btn"
                >
                  Crear Nueva Categoría
                </button>
              )}
            </>
          ) : (
            <div className="custom-category-input">
              <input
                type="text"
                value={customCategoryName}
                onChange={(e) => setCustomCategoryName(e.target.value)}
                placeholder="Nombre de la nueva categoría"
                autoFocus
              />
              <div className="category-buttons">
                <button
                  type="button"
                  onClick={handleAddCustomCategory}
                  className="save-category-btn"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCustomCategoryInput(false);
                    setCategory('');
                  }}
                  className="cancel-category-btn"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
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

        <button type="submit" className="submit-btn">
          Agregar Transacción
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;