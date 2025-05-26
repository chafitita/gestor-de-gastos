
"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import BudgetForm from "@/components/budget-form";
import TransactionList from "@/components/transaction-list";
import CategoryBarChart from "@/components/category-bar-chart";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlusCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Helper to get month name in Spanish
const getMonthNameDisplay = (monthUrl) => {
  if (!monthUrl) return "";
  return monthUrl.charAt(0).toUpperCase() + monthUrl.slice(1);
};
const getMonthIndexFromString = (monthName) => {
  const lowerMonthName = monthName.toLowerCase();
  const monthNames = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  return monthNames.indexOf(lowerMonthName);
}


export default function MonthDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { year: yearParam, month: monthParam } = params;

  const year = parseInt(yearParam);
  const monthName = getMonthNameDisplay(monthParam);
  const monthIndex = getMonthIndexFromString(monthParam);


  const [allTransactions, setAllTransactions] = React.useState([]);
  const [transactionsForMonth, setTransactionsForMonth] = React.useState([]);
  const [categoryTotals, setCategoryTotals] = React.useState([]);
  const [showForm, setShowForm] = React.useState(false);

  React.useEffect(() => {
    const storedTransactions = localStorage.getItem("budgetwise-transactions");
    if (storedTransactions) {
      const parsedTransactions = JSON.parse(storedTransactions);
      setAllTransactions(parsedTransactions);
    }
  }, []);

  React.useEffect(() => {
    if (allTransactions.length > 0 && !isNaN(year) && monthIndex !== -1) {
      const filtered = allTransactions.filter(t => {
        const date = new Date(t.date);
        return date.getFullYear() === year && date.getMonth() === monthIndex;
      });
      setTransactionsForMonth(filtered);

      const totals = filtered
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
          if (!acc[t.subCategory]) {
            acc[t.subCategory] = 0;
          }
          acc[t.subCategory] += t.amount;
          return acc;
        }, {});
      
      setCategoryTotals(Object.entries(totals).map(([name, value]) => ({ name, value })));
    } else {
        setTransactionsForMonth([]);
        setCategoryTotals([]);
    }
  }, [allTransactions, year, monthIndex]);

  const addTransactionHandler = (newTransactionData) => {
    const newTransaction = {
      ...newTransactionData,
      id: crypto.randomUUID(),
      // Ensure date is set to the current month/year if form doesn't specify
      // For now, BudgetForm sets current date, which might be outside the viewed month.
      // This could be enhanced by passing defaultDate to BudgetForm.
      date: newTransactionData.date || new Date(year, monthIndex, new Date().getDate()).toISOString(),
    };
    const updatedTransactions = [newTransaction, ...allTransactions];
    setAllTransactions(updatedTransactions);
    localStorage.setItem("budgetwise-transactions", JSON.stringify(updatedTransactions));
    setShowForm(false); // Optionally hide form after adding
  };


  if (isNaN(year) || monthIndex === -1) {
    return (
      <main className="container mx-auto px-4 py-8 min-h-screen flex flex-col items-center">
        <Card className="w-full max-w-lg text-center">
            <CardHeader>
                <CardTitle>Mes o Año Inválido</CardTitle>
            </CardHeader>
            <CardContent>
                <p>El mes o año especificado no es válido.</p>
                <Button onClick={() => router.push('/')} className="mt-4">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Inicio
                </Button>
            </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={() => router.push('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver
        </Button>
        <h2 className="text-3xl font-bold text-primary">
          Detalle Diario: {monthName} {year}
        </h2>
        <Button onClick={() => setShowForm(!showForm)}>
          <PlusCircle className="mr-2 h-4 w-4" /> {showForm ? "Ocultar Formulario" : "Añadir Transacción"}
        </Button>
      </div>

      {showForm && (
        <div className="mb-8">
          <BudgetForm onAddTransaction={addTransactionHandler} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <TransactionList transactions={transactionsForMonth} />
        </div>
        <div className="lg:col-span-1">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-center">Gastos por Categoría</CardTitle>
            </CardHeader>
            <CardContent>
              {categoryTotals.length > 0 ? (
                <CategoryBarChart data={categoryTotals} />
              ) : (
                <p className="text-center text-muted-foreground py-8">No hay gastos para mostrar en el gráfico.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
