
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const MonthSummaryCard = ({ monthName, year, income, expenses, balance }) => {
  const progressPercentage = income > 0 ? (expenses / income) * 100 : 0;

  return (
    <Card className="shadow-md hover:shadow-xl transition-shadow duration-200 cursor-pointer h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-primary">{monthName} {year}</CardTitle>
        <CardDescription>Resumen del mes</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between">
        <div className="space-y-2 mb-4">
          <div>
            <p className="text-xs text-muted-foreground">Ingresos</p>
            <p className="text-md font-medium" style={{color: 'var(--chart-3)'}}>${income.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Gastos</p>
            <p className="text-md font-medium" style={{color: 'var(--chart-4)'}}>${expenses.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Restante</p>
            <p className={cn("text-lg font-semibold", balance >= 0 ? "text-blue-600" : "text-orange-600")}>
              ${balance.toFixed(2)}
            </p>
          </div>
        </div>
        <div>
          <Progress value={Math.min(progressPercentage, 100)} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1 text-right">{Math.min(progressPercentage, 100).toFixed(0)}% gastado de ingresos</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthSummaryCard;
