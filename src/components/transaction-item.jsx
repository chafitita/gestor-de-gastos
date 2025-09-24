
"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  TrendingUp, TrendingDown, Briefcase, Landmark, ShoppingCart, GraduationCap,
  Undo2, Home, Car, HeartPulse, BookOpen, Wrench, Receipt, Gamepad2, HelpCircle
} from "lucide-react";

const getCategoryIcon = (category) => {
  const iconMap = {
    "Sueldo": Briefcase,
    "Inversiones": Landmark,
    "Ventas": ShoppingCart,
    "Becas Educativas": GraduationCap,
    "Reembolsos": Undo2,
    "Vivienda": Home,
    "Transporte": Car,
    "Salud": HeartPulse,
    "Educación": BookOpen,
    "Servicios": Wrench,
    "Impuestos": Receipt,
    "Entretenimiento": Gamepad2,
  };
  return iconMap[category] || HelpCircle;
};

const TransactionItem = ({ transaction }) => {
  const { amount, type, subCategory, date } = transaction;
  const isIncome = type === 'income';
  const IconComponent = getCategoryIcon(subCategory);

  return (
    <div className={cn(
      "flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors duration-150 border-b",
      isIncome ? "border-l-4 border-accent" : "border-l-4 border-destructive"
    )}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <IconComponent size={20} className={cn("shrink-0", isIncome ? "text-accent" : "text-destructive")} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate text-foreground">{subCategory}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end ml-4">
        <p className={cn(
          "text-md font-semibold",
          isIncome ? "text-accent" : "text-destructive"
        )}>
          {isIncome ? '+' : '-'}${amount.toFixed(2)}
        </p>
        <Badge 
            variant={isIncome ? "default" : "destructive"} 
            className={cn(
                "text-xs mt-1",
                isIncome ? "bg-accent/20 text-accent-foreground border-accent/30" : "bg-destructive/20 text-destructive-foreground border-destructive/30"
            )}
            style={isIncome ? {backgroundColor: 'hsl(var(--accent) / 0.1)', color: 'hsl(var(--accent))'} : {backgroundColor: 'hsl(var(--destructive) / 0.1)', color: 'hsl(var(--destructive))'} }
        >
          {isIncome ? "Ingreso" : "Gasto"}
        </Badge>
      </div>
    </div>
  );
};

export default TransactionItem;
