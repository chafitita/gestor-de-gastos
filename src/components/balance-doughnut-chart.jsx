
"use client"

import * as React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BalanceDoughnutChart = ({ income, expenses }) => {
  const data = [];

  if (income > 0) {
    data.push({ name: 'Ingresos', value: income, color: 'hsl(var(--chart-3))' });
  }
  if (expenses > 0) {
     data.push({ name: 'Gastos', value: expenses, color: 'hsl(var(--chart-4))' });
  }
  
  const COLORS = data.map(entry => entry.color);

  if (data.length === 0) {
    return (
        <div className="text-center py-4 text-muted-foreground h-[200px] flex items-center justify-center">
            <p>No hay datos para el gráfico.</p>
        </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={data.length > 1 ? 2 : 0}
          dataKey="value"
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value, name) => [`$${value.toFixed(2)}`, name]}/>
        <Legend wrapperStyle={{fontSize: "0.8rem"}}/>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default BalanceDoughnutChart;
