
"use client";

import TransactionItem from "./transaction-item";
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';

const TransactionList = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <Card className="w-full shadow-lg">
        <CardHeader>
            <CardTitle className="text-xl font-semibold text-center text-foreground">Historial de Transacciones</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-center text-muted-foreground py-8">No hay transacciones para este período.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg">
       <CardHeader>
        <CardTitle className="text-xl font-semibold text-center text-foreground">Historial de Transacciones</CardTitle>
      </CardHeader>
      <CardContent className="p-0"> {/* Remove padding for edge-to-edge list items */}
        <ScrollArea className="h-[450px]"> {/* Adjust height as needed */}
          <div className="space-y-0"> {/* Remove space-y for tighter list */}
            {transactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TransactionList;
