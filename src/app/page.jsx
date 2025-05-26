
"use client";

import * as React from "react";
import Link from "next/link";
import MonthSummaryCard from "@/components/month-summary-card";
import BalanceDoughnutChart from "@/components/balance-doughnut-chart";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Helper to get month name in Spanish
const getMonthName = (monthIndex) => {
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  return monthNames[monthIndex];
};

export default function HomePage() {
  const [transactions, setTransactions] = React.useState([]);
  const [monthlyData, setMonthlyData] = React.useState([]);
  const [overallBalance, setOverallBalance] = React.useState(0);
  const [totalIncomeOverall, setTotalIncomeOverall] = React.useState(0);
  const [totalExpensesOverall, setTotalExpensesOverall] = React.useState(0);

  React.useEffect(() => {
    const storedTransactions = localStorage.getItem("budgetwise-transactions");
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
  }, []);

  React.useEffect(() => {
    if (transactions.length > 0) {
      const currentYear = new Date().getFullYear();
      // For simplicity, let's just show current year's months, or a fixed range for demo
      // A more robust solution would group all transactions by their actual month/year.
      
      // Group transactions by month and year
      const groupedByMonth = transactions.reduce((acc, t) => {
        const date = new Date(t.date);
        const year = date.getFullYear();
        const month = date.getMonth(); // 0-11
        const key = `${year}-${month}`;
        if (!acc[key]) {
          acc[key] = { year, monthIndex: month, monthName: getMonthName(month), income: 0, expenses: 0, transactions: [] };
        }
        if (t.type === 'income') {
          acc[key].income += t.amount;
        } else {
          acc[key].expenses += t.amount;
        }
        acc[key].transactions.push(t);
        return acc;
      }, {});

      const processedMonthlyData = Object.values(groupedByMonth)
        .map(data => ({
          ...data,
          balance: data.income - data.expenses,
        }))
        .sort((a, b) => b.year - a.year || b.monthIndex - a.monthIndex); // Sort newest first

      setMonthlyData(processedMonthlyData);

      const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      setTotalIncomeOverall(totalIncome);
      setTotalExpensesOverall(totalExpenses);
      setOverallBalance(totalIncome - totalExpenses);
    } else {
      // Set some placeholder months if no transactions
      const currentMonth = new Date().getMonth();
      const currentYr = new Date().getFullYear();
      const placeholderMonths = Array.from({ length: 4 }, (_, i) => {
        const d = new Date(currentYr, currentMonth - i, 1);
        return {
          year: d.getFullYear(),
          monthIndex: d.getMonth(),
          monthName: getMonthName(d.getMonth()),
          income: 0,
          expenses: 0,
          balance: 0,
          isPlaceholder: true,
        };
      }).reverse();
      setMonthlyData(placeholderMonths);
      setOverallBalance(0);
      setTotalIncomeOverall(0);
      setTotalExpensesOverall(0);
    }
  }, [transactions]);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {monthlyData.length > 0 ? monthlyData.map(month => (
          <Link key={`${month.year}-${month.monthName}`} href={`/month/${month.year}/${month.monthName.toLowerCase()}`} passHref>
            <MonthSummaryCard
              monthName={month.monthName}
              year={month.year}
              income={month.income}
              expenses={month.expenses}
              balance={month.balance}
            />
          </Link>
        )) : (
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-center">No hay datos de meses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">
                Aún no hay transacciones para mostrar resúmenes mensuales.
              </p>
              <div className="mt-4 text-center">
                 <Link href="/month/new/transaction" passHref>
                    <Button>
                        <PlusCircle className="mr-2 h-5 w-5" />
                        Añadir Primera Transacción
                    </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {transactions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <Card className="md:col-span-1 p-4 flex flex-col items-center justify-center shadow-lg">
             <h2 className="text-xl font-semibold mb-2 text-center text-foreground">Balance General</h2>
             <BalanceDoughnutChart 
                income={totalIncomeOverall} 
                expenses={totalExpensesOverall} 
             />
             <p className="mt-4 text-3xl font-bold" style={{ color: overallBalance >= 0 ? 'var(--chart-2)' : 'var(--destructive)' }}>
                ${overallBalance.toFixed(2)}
             </p>
             <p className="text-sm text-muted-foreground">Balance Total Actual</p>
          </Card>
          <Card className="md:col-span-2 p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Resumen General</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Ingresos Totales (General)</p>
                <p className="text-2xl font-semibold" style={{color: 'var(--chart-3)'}}>${totalIncomeOverall.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gastos Totales (General)</p>
                <p className="text-2xl font-semibold" style={{color: 'var(--chart-4)'}}>${totalExpensesOverall.toFixed(2)}</p>
              </div>
            </div>
             <div className="mt-6 text-center">
                 <Link href={`/month/${new Date().getFullYear()}/${getMonthName(new Date().getMonth()).toLowerCase()}`} passHref>
                    <Button variant="outline">
                        <PlusCircle className="mr-2 h-5 w-5" />
                        Añadir Transacción al Mes Actual
                    </Button>
                </Link>
              </div>
          </Card>
        </div>
      )}

      {transactions.length === 0 && !monthlyData.find(m=>!m.isPlaceholder) && (
         <div className="mt-12 text-center p-8 bg-card rounded-lg shadow-md max-w-lg mx-auto">
            <h2 className="text-2xl font-semibold mb-4">¡Bienvenido!</h2>
            <p className="text-muted-foreground mb-6">
              Comienza a administrar tus finanzas. Añade tu primera transacción para ver tus resúmenes mensuales y balance.
            </p>
         </div>
      )}
    </main>
  );
}
