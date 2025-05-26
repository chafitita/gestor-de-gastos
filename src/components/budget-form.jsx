
"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { incomeCategories as baseIncomeCategories, expenseCategories as baseExpenseCategories } from "@/types";
import { PlusCircle, Save, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Define the Zod schema for validation and transformation
const formSchema = z.object({
  amount: z.string()
    .refine(val => val === "" || (!isNaN(Number(val)) && isFinite(Number(val))), { message: "Monto inválido." })
    .transform(val => val === "" ? 0 : parseFloat(val)) 
    .pipe(z.number().positive({ message: "El monto debe ser positivo." }).or(z.literal(0))),
  
  type: z.enum(["income", "expense"], { required_error: "Seleccione un tipo." }),
  subCategory: z.string().min(1, { message: "Seleccione una subcategoría." }),
});


const BudgetForm = ({ onAddTransaction }) => {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
    trigger,
  } = useForm({ 
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      type: "income",
      subCategory: "",
    },
    mode: "onChange", 
  });

  const { toast } = useToast();
  const [customIncomeCategories, setCustomIncomeCategories] = React.useState([]);
  const [customExpenseCategories, setCustomExpenseCategories] = React.useState([]);
  const [newCategoryName, setNewCategoryName] = React.useState("");
  const [showAddCategoryInput, setShowAddCategoryInput] = React.useState(false);

  React.useEffect(() => {
    const storedCustomCategories = localStorage.getItem("budgetwise_custom_categories");
    if (storedCustomCategories) {
      try {
        const parsed = JSON.parse(storedCustomCategories);
        if (parsed.income && Array.isArray(parsed.income)) setCustomIncomeCategories(parsed.income);
        if (parsed.expense && Array.isArray(parsed.expense)) setCustomExpenseCategories(parsed.expense);
      } catch (error) {
        console.error("Error parsing custom categories from localStorage:", error);
        // Optionally clear corrupted data
        // localStorage.removeItem("budgetwise_custom_categories");
      }
    }
  }, []);

  const saveCustomCategoriesToLocalStorage = (incomeCats, expenseCats) => {
    localStorage.setItem(
      "budgetwise_custom_categories",
      JSON.stringify({ income: incomeCats, expense: expenseCats })
    );
  };

  const selectedType = watch("type");

  const currentBaseCategories = React.useMemo(() => 
    selectedType === "income" ? baseIncomeCategories : baseExpenseCategories,
  [selectedType]);

  const currentCustomCategories = React.useMemo(() =>
    selectedType === "income" ? customIncomeCategories : customExpenseCategories,
  [selectedType, customIncomeCategories, customExpenseCategories]);
  
  const combinedCategories = React.useMemo(() => {
    return [...new Set([...currentBaseCategories, ...currentCustomCategories])].sort((a,b) => a.localeCompare(b));
  }, [currentBaseCategories, currentCustomCategories]);


  const handleAddCategoryClick = () => {
    setShowAddCategoryInput(true);
    setNewCategoryName("");
  };

  const handleCancelAddCategory = () => {
    setShowAddCategoryInput(false);
    setNewCategoryName("");
  };

  const handleSaveNewCategory = () => {
    const trimmedName = newCategoryName.trim();
    if (!trimmedName) {
      toast({ title: "Error", description: "El nombre de la categoría no puede estar vacío.", variant: "destructive" });
      return;
    }

    const categoryExists = combinedCategories.some(
      (cat) => cat.toLowerCase() === trimmedName.toLowerCase()
    );

    if (categoryExists) {
      toast({ title: "Error", description: "Esta categoría ya existe.", variant: "destructive" });
      return;
    }

    let updatedCustomIncome = customIncomeCategories;
    let updatedCustomExpense = customExpenseCategories;

    if (selectedType === "income") {
      updatedCustomIncome = [...customIncomeCategories, trimmedName];
      setCustomIncomeCategories(updatedCustomIncome);
    } else {
      updatedCustomExpense = [...customExpenseCategories, trimmedName];
      setCustomExpenseCategories(updatedCustomExpense);
    }
    saveCustomCategoriesToLocalStorage(updatedCustomIncome, updatedCustomExpense);

    setValue("subCategory", trimmedName); 
    setShowAddCategoryInput(false);
    setNewCategoryName("");
    toast({ title: "Éxito", description: `Categoría "${trimmedName}" añadida.` });
  };

  const onSubmit = async (data) => {
    const isValidAmount = await trigger("amount");
    if (!isValidAmount || data.amount === 0) {
      // Ensure amount is validated again if it was initially empty or zero
      // Zod's positive check should handle this after parsing.
      if (data.amount === 0 && errors.amount?.message !== "El monto debe ser positivo.") {
         // Manually set error if it's 0 and not caught by positive check (e.g. if 0 allowed by schema temporarily)
         // This part might be redundant if Zod schema correctly disallows 0 for final submission.
      }
      return; 
    }

    onAddTransaction({
      amount: data.amount,
      type: data.type,
      subCategory: data.subCategory,
      // Ensure date is added here if not added by parent
      date: new Date().toISOString(), 
    });
    reset({ amount: "", type: selectedType, subCategory: "" }); // Preserve selected type
  };


  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center">Añadir Transacción</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">Monto</Label>
            <Controller
              name="amount"
              control={control}
              render={({ field }) => ( 
                <Input
                  {...field} 
                  id="amount"
                  type="number" 
                  step="0.01"
                  placeholder="0.00"
                  className="text-base"
                  onChange={(e) => {
                    let value = e.target.value;
                    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
                       field.onChange(value);
                    }
                  }}
                />
              )}
            />
            {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Tipo</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={(value) => {
                    field.onChange(value);
                    setValue("subCategory", ""); 
                  }}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="income" id="income" />
                    <Label htmlFor="income" className="font-normal">Ingreso</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="expense" id="expense" />
                    <Label htmlFor="expense" className="font-normal">Gasto</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between mb-1">
              <Label htmlFor="subCategory" className="text-sm font-medium">
                {selectedType === "income" ? "Categoría de Ingreso" : "Categoría de Gasto"}
              </Label>
              {!showAddCategoryInput && (
                <Button type="button" variant="ghost" size="sm" onClick={handleAddCategoryClick} className="p-1 h-auto text-xs">
                  <PlusCircle className="h-3 w-3 mr-1" /> Añadir Nueva
                </Button>
              )}
            </div>

            {showAddCategoryInput && (
              <div className="space-y-2 mt-1 mb-3 p-3 border rounded-md bg-muted/10 shadow-sm">
                <Input
                  type="text"
                  placeholder="Nombre de la nueva categoría"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="text-sm h-9 bg-background"
                />
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" size="sm" onClick={handleCancelAddCategory} className="h-8">
                    <XCircle className="mr-1 h-4 w-4" /> Cancelar
                  </Button>
                  <Button type="button" size="sm" onClick={handleSaveNewCategory} className="h-8">
                    <Save className="mr-1 h-4 w-4" /> Guardar
                  </Button>
                </div>
              </div>
            )}
            
            <Controller
              name="subCategory"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="subCategory">
                    <SelectValue placeholder="Seleccione una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {combinedCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.subCategory && <p className="text-sm text-destructive">{errors.subCategory.message}</p>}
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            <PlusCircle className="mr-2 h-5 w-5" />
            Añadir Transacción
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BudgetForm;

