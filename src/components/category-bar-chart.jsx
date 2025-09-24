
"use client";

import * as React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const CategoryBarChart = ({ data }) => {
  const chartColors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
  ];

  if (!data || data.length === 0) {
    return <p className="text-muted-foreground text-center py-4">No hay datos de categorías para mostrar.</p>;
  }
  
  const chartData = data.map(item => ({
    name: item.name,
    value: item.value,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis type="number" stroke="hsl(var(--foreground))" />
        <YAxis dataKey="name" type="category" stroke="hsl(var(--foreground))" width={80} interval={0} tick={{fontSize: 10}} />
        <Tooltip
          formatter={(value) => `$${value.toFixed(2)}`}
          cursor={{ fill: 'hsl(var(--muted))', fillOpacity: 0.3 }}
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            borderColor: 'hsl(var(--border))',
            borderRadius: 'var(--radius)',
          }}
        />
        {/* <Legend /> */}
        <Bar dataKey="value" barSize={20}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CategoryBarChart;
