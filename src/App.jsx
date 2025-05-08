import { useState } from 'react'
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import TransactionForm from './components/IngresarDinero'
import './App.css'

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [customCategories, setCustomCategories] = useState({
    income: [],
    expense: []
  });

  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions');
    const savedCategories = localStorage.getItem('customCategories');
    
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
    
    if (savedCategories) {
      setCustomCategories(JSON.parse(savedCategories));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('customCategories', JSON.stringify(customCategories));
  }, [transactions, customCategories]);

  const addTransaction = (transaction) => {
    setTransactions([...transactions, transaction]);
    toast.success(
      `${transaction.type === 'expense' ? 'Gasto' : 'Ingreso'} agregado correctamente`, 
      { position: "top-right", autoClose: 3000 }
    );
  };

  const deleteTransaction = (id) => {
    const transactionToDelete = transactions.find(t => t.id === id);
    setTransactions(transactions.filter(t => t.id !== id));
    toast.error(
      `Transacción de ${transactionToDelete.category} eliminada`, 
      { position: "top-right", autoClose: 3000 }
    );
  };

  const addCustomCategory = (type, categoryName) => {
    if (!categoryName.trim()) {
      toast.warn('El nombre de la categoría no puede estar vacío', {
        position: "top-right",
        autoClose: 3000
      });
      return false;
    }

    if (customCategories[type].includes(categoryName)) {
      toast.warn('Esta categoría ya existe', {
        position: "top-right",
        autoClose: 3000
      });
      return false;
    }

    setCustomCategories(prev => ({
      ...prev,
      [type]: [...prev[type], categoryName]
    }));

    toast.success(`Categoría "${categoryName}" agregada`, {
      position: "top-right",
      autoClose: 3000
    });

    return true;
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
                <span className="category">{transaction.category}</span>
                {transaction.description && (
                  <span className="description"> - {transaction.description}</span>
                )}
                <span className="amount">
                  {transaction.type === 'expense' ? '-' : '+'}
                  ${transaction.amount}
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
