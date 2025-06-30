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
  const fetchTransactions = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/gastos");

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al cargar transacciones");
      }

      const data = await res.json();
      setTransactions(data);
    } catch (error) {
      toast.error(`Error al cargar transacciones: ${error.message}`, {
        position: "top-right",
        autoClose: 3000
      });
    }
  };

  fetchTransactions();
}, []);



  useEffect(() => {
  const fetchCustomCategories = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/custom-categories");

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al obtener categorías");
      }

      const data = await res.json();
      const formatted = { income: [], expense: [] };

      for (const category of data) {
        if (category.type === "income") {
          formatted.income.push(category.name);
        } else if (category.type === "expense") {
          formatted.expense.push(category.name);
        }
      }

      setCustomCategories(formatted);
    } catch (error) {
      toast.error(`Error al cargar categorías: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  fetchCustomCategories();
}, []);

  const addTransaction = async (transaction) => {
  try {
    const res = await fetch("http://localhost:3000/api/gastos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(transaction)
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Error al agregar la transacción");
    }

    const savedTransaction = await res.json();
    setTransactions(prev => [...prev, savedTransaction]);

    toast.success(
      `${savedTransaction.type === 'expense' ? 'Gasto' : 'Ingreso'} agregado correctamente`, 
      { position: "top-right", autoClose: 3000 }
    );
  } catch (err) {
    toast.error(`Error: ${err.message}`, {
      position: "top-right",
      autoClose: 3000
    });
  }
};


  const deleteTransaction = async (id) => {
  try {
    const transactionToDelete = transactions.find(t => t.id === id);

    const res = await fetch(`http://localhost:3000/api/gastos/${id}`, {
      method: "DELETE"
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Error al eliminar la transacción");
    }

    setTransactions(transactions.filter(t => t.id !== id));

    toast.error(
      `Transacción de ${transactionToDelete.category} eliminada`, 
      { position: "top-right", autoClose: 3000 }
    );
  } catch (err) {
    toast.error(`Error: ${err.message}`, {
      position: "top-right",
      autoClose: 3000
    });
  }
};


  const addCustomCategory = async (type, categoryName) => {
  if (!categoryName.trim()) {
    toast.warn("El nombre de la categoría no puede estar vacío", {
      position: "top-right",
      autoClose: 3000,
    });
    return false;
  }

  // Verificamos si ya existe localmente
  if (customCategories[type].includes(categoryName)) {
    toast.warn("Esta categoría ya existe", {
      position: "top-right",
      autoClose: 3000,
    });
    return false;
  }

  try {
    const res = await fetch("http://localhost:3000/api/categorias/custom", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, name: categoryName }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Error al agregar categoría");
    }

    setCustomCategories((prev) => ({
      ...prev,
      [type]: [...prev[type], categoryName],
    }));

    toast.success(`Categoría "${categoryName}" agregada`, {
      position: "top-right",
      autoClose: 3000,
    });

    return true;
  } catch (error) {
    toast.error(`Error al agregar categoría: ${error.message}`, {
      position: "top-right",
      autoClose: 3000,
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
