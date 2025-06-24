import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import TransactionForm from './components/IngresarDinero';
import './App.css';

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [customCategories, setCustomCategories] = useState({
    income: [],
    expense: []
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/transactions");
        const data = await res.json();
        setTransactions(data);
      } catch (error) {
        console.error("Error cargando transacciones:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/categories");
        const data = await res.json();
        const income = data.filter(cat => cat.type === "income").map(c => c.name);
        const expense = data.filter(cat => cat.type === "expense").map(c => c.name);
        setCustomCategories({ income, expense });
      } catch (error) {
        console.error("Error cargando categorías:", error);
      }
    };

    fetchTransactions();
    fetchCategories();
  }, []);

  const addTransaction = async (transaction) => {
    try {
      const res = await fetch("http://localhost:3001/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: transaction.amount,
          type: transaction.type,
          categoryId: transaction.categoryId, // asegurate que esté disponible
          description: transaction.description,
          date: transaction.date
        })
      });
      const newTransaction = await res.json();
      setTransactions([...transactions, newTransaction]);
      toast.success("Transacción agregada correctamente", {
        position: "top-right",
        autoClose: 3000
      });
    } catch (error) {
      toast.error("Error al agregar transacción", {
        position: "top-right",
        autoClose: 3000
      });
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await fetch(`http://localhost:3001/api/transactions/${id}`, {
        method: "DELETE",
      });
      setTransactions(transactions.filter(t => t.id !== id));
      toast.error("Transacción eliminada", {
        position: "top-right",
        autoClose: 3000
      });
    } catch (error) {
      toast.error("Error al eliminar transacción", {
        position: "top-right",
        autoClose: 3000
      });
    }
  };

  const addCustomCategory = async (type, categoryName) => {
    try {
      const res = await fetch("http://localhost:3001/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: categoryName, type })
      });
      const newCategory = await res.json();
      setCustomCategories(prev => ({
        ...prev,
        [type]: [...prev[type], newCategory.name]
      }));
      toast.success(`Categoría "${categoryName}" agregada`, {
        position: "top-right",
        autoClose: 3000
      });
      return true;
    } catch (error) {
      toast.error("Error al agregar categoría", {
        position: "top-right",
        autoClose: 3000
      });
      return false;
    }
  };

  return (
    <div className="app-container">
      <h1>Gestor de Gastos</h1>
      <TransactionForm 
        onAddTransaction={addTransaction}
        customCategories={customCategories}
        onAddCustomCategory={addCustomCategory}
      />

      <div className="transactions-list">
        <h2>Historial de Transacciones</h2>
        {transactions.length === 0 ? (
          <p>No hay transacciones registradas</p>
        ) : (
          <ul>
            {transactions.map((transaction) => (
              <li key={transaction.id} className={transaction.type}>
                <span className="category">{transaction.Category?.name || transaction.category}</span>
                {transaction.description && (
                  <span className="description"> - {transaction.description}</span>
                )}
                <span className="amount">
                  {transaction.type === 'expense' ? '-' : '+'}${transaction.amount}
                </span>
                <span className="date">
                  {new Date(transaction.date).toLocaleDateString()}
                </span>
                <button 
                  onClick={() => deleteTransaction(transaction.id)}
                  className="delete-btn"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default App;
