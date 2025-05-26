
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import BudgetForm from "@/components/budget-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewTransactionPage() {
  const router = useRouter();
  const [allTransactions, setAllTransactions] = React.useState([]);

  React.useEffect(() => {
    const storedTransactions = localStorage.getItem("budgetwise-transactions");
    if (storedTransactions) {
      setAllTransactions(JSON.parse(storedTransactions));
    }
  }, []);

  const addTransactionHandler = (newTransactionData) => {
    const newTransaction = {
      ...newTransactionData,
      id: crypto.randomUUID(),
      date: newTransactionData.date || new Date().toISOString(),
    };
    const updatedTransactions = [newTransaction, ...allTransactions];
    setAllTransactions(updatedTransactions);
    localStorage.setItem("budgetwise-transactions", JSON.stringify(updatedTransactions));
    
    // Navigate to the month page of the new transaction
    const transactionDate = new Date(newTransaction.date);
    const year = transactionDate.getFullYear();
    const month = transactionDate.toLocaleString('default', { month: 'long' }).toLowerCase();
    router.push(`/month/${year}/${month}`);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver
        </Button>
        <h2 className="text-3xl font-bold text-primary">
          Añadir Nueva Transacción
        </h2>
        <div></div> {/* Spacer */}
      </div>

      <div className="max-w-md mx-auto">
        <BudgetForm onAddTransaction={addTransactionHandler} />
      </div>
    </main>
  );
}
