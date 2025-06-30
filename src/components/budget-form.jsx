
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
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogClose 
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { incomeCategories as baseIncomeCategories, expenseCategories as baseExpenseCategories } from "@/types";
import { PlusCircle, Save, XCircle, Pencil, Trash2 } from "lucide-react";
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

  const [isManageCategoriesDialogOpen, setIsManageCategoriesDialogOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState(null); 
  const [editedCategoryName, setEditedCategoryName] = React.useState("");

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [categoryToDelete, setCategoryToDelete] = React.useState(null); // { type: string, name: string }


  React.useEffect(() => {
  const fetchCustomCategories = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/categorias/base");
      const data = await res.json();
      setCustomIncomeCategories(data.income || []);
      setCustomExpenseCategories(data.expense || []);
    } catch (error) {
      toast({ title: "Error", description: "Error al cargar categorías desde el servidor.", variant: "destructive" });
    }
  };
  fetchCustomCategories();
}, []);

  const saveCustomCategoriesToLocalStorage = (incomeCats, expenseCats) => {
    localStorage.setItem(
      "budgetwise_custom_categories",
      JSON.stringify({ 
        income: incomeCats, // Directly use the provided arrays
        expense: expenseCats 
      })
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

  const handleSaveNewCategory = async () => {
  const trimmedName = newCategoryName.trim();
  if (!trimmedName) {
    toast({ title: "Error", description: "El nombre de la categoría no puede estar vacío.", variant: "destructive" });
    return;
  }

  const allCategories = selectedType === 'income' 
    ? [...baseIncomeCategories, ...customIncomeCategories] 
    : [...baseExpenseCategories, ...customExpenseCategories];

  if (allCategories.some(cat => cat.toLowerCase() === trimmedName.toLowerCase())) {
    toast({ title: "Error", description: "Esta categoría ya existe.", variant: "destructive" });
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: selectedType, name: trimmedName }),
    });
    const newCategory = await res.json();

    if (selectedType === "income") {
      setCustomIncomeCategories(prev => [...prev, newCategory.name]);
    } else {
      setCustomExpenseCategories(prev => [...prev, newCategory.name]);
    }

    setValue("subCategory", newCategory.name);
    toast({ title: "Éxito", description: `Categoría "${newCategory.name}" añadida.` });
    setNewCategoryName("");
    setShowAddCategoryInput(false);
  } catch (err) {
    toast({ title: "Error", description: "No se pudo guardar la categoría.", variant: "destructive" });
  }
};


  const handleEditCategory = (type, oldName) => {
    setEditingCategory({ type, oldName });
    setEditedCategoryName(oldName);
  };

  const handleCancelEditCategory = () => {
    setEditingCategory(null);
    setEditedCategoryName("");
  };
  
  const handleSaveEditedCategory = async () => {
  if (!editingCategory) return;
  const { type, oldName } = editingCategory;
  const newName = editedCategoryName.trim();

  if (!newName || newName === oldName) {
    handleCancelEditCategory();
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/api/categories", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, oldName, newName }),
    });

    if (!res.ok) throw new Error("Error en el servidor");

    const updateCategoryState = (prev) => prev.map(cat => cat === oldName ? newName : cat);
    if (type === "income") {
      setCustomIncomeCategories(updateCategoryState);
    } else {
      setCustomExpenseCategories(updateCategoryState);
    }

    if (watch("subCategory") === oldName && selectedType === type) {
      setValue("subCategory", newName);
    }

    toast({ title: "Éxito", description: `Categoría renombrada a "${newName}".` });
    handleCancelEditCategory();
  } catch (err) {
    toast({ title: "Error", description: "No se pudo editar la categoría.", variant: "destructive" });
  }
};

  const handleDeleteCategoryClick = (type, categoryName) => {
    setCategoryToDelete({ type, name: categoryName });
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDeleteCategory = async () => {
  if (!categoryToDelete) return;
  const { type, name } = categoryToDelete;

  try {
    const res = await fetch("http://localhost:3000/api/categories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, name }),
    });

    if (!res.ok) throw new Error("Error al eliminar");

    if (type === "income") {
      setCustomIncomeCategories(prev => prev.filter(cat => cat !== name));
    } else {
      setCustomExpenseCategories(prev => prev.filter(cat => cat !== name));
    }

    if (watch("subCategory") === name && selectedType === type) {
      setValue("subCategory", "");
      trigger("subCategory");
    }

    toast({ title: "Éxito", description: `Categoría "${name}" eliminada.` });
  } catch (err) {
    toast({ title: "Error", description: "No se pudo eliminar la categoría.", variant: "destructive" });
  }

  setIsDeleteDialogOpen(false);
  setCategoryToDelete(null);
};



  const onSubmit = async (data) => {
    const isValidAmount = await trigger("amount"); // Validate specific field
    if (!isValidAmount || data.amount === 0) { // Check transformed value
      // Ensure error message is shown for amount if invalid or zero
      if (!isValidAmount) errors.amount = { message: "Monto inválido." }; // Manually set error if not already
      else if (data.amount === 0) errors.amount = { message: "El monto debe ser positivo." };
      return; 
    }

    onAddTransaction({
      amount: data.amount,
      type: data.type,
      subCategory: data.subCategory,
      date: new Date().toISOString(), 
    });
    reset({ amount: "", type: selectedType, subCategory: "" }); // Keep selectedType, reset others
  };


  return (
    <>
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
                      if (value === "" || /^[0-9]*\.?[0-9]{0,2}$/.test(value) || value === "0") {
                         field.onChange(value);
                      }
                    }}
                    onBlur={() => trigger("amount")} // Trigger validation on blur
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
                      trigger("subCategory"); // Clear validation state for subCategory
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
                <div className="flex items-center gap-2">
                    {!showAddCategoryInput && (
                        <Button type="button" variant="ghost" size="sm" onClick={handleAddCategoryClick} className="p-1 h-auto text-xs">
                        <PlusCircle className="h-3 w-3 mr-1" /> Añadir Nueva
                        </Button>
                    )}
                    <Button type="button" variant="outline" size="sm" onClick={() => setIsManageCategoriesDialogOpen(true)} className="p-1 h-auto text-xs">
                        <Pencil className="h-3 w-3 mr-1" /> Gestionar
                    </Button>
                </div>
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
                  <Select 
                    onValueChange={(value) => {
                        field.onChange(value);
                        trigger("subCategory"); // Validate on change
                    }} 
                    value={field.value}
                  >
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

      <Dialog open={isManageCategoriesDialogOpen} onOpenChange={(isOpen) => {
        setIsManageCategoriesDialogOpen(isOpen);
        if (!isOpen) { // Reset editing state when main dialog closes
            handleCancelEditCategory();
        }
      }}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Gestionar Categorías Personalizadas</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="income" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="income">Ingresos</TabsTrigger>
              <TabsTrigger value="expense">Gastos</TabsTrigger>
            </TabsList>
            <TabsContent value="income">
              <CategoryManagerList
                type="income"
                categories={customIncomeCategories}
                onEdit={handleEditCategory}
                editingCategory={editingCategory}
                editedCategoryName={editedCategoryName}
                onNameChange={setEditedCategoryName}
                onSaveEdit={handleSaveEditedCategory}
                onCancelEdit={handleCancelEditCategory}
                onDeleteClick={handleDeleteCategoryClick}
              />
            </TabsContent>
            <TabsContent value="expense">
               <CategoryManagerList
                type="expense"
                categories={customExpenseCategories}
                onEdit={handleEditCategory}
                editingCategory={editingCategory}
                editedCategoryName={editedCategoryName}
                onNameChange={setEditedCategoryName}
                onSaveEdit={handleSaveEditedCategory}
                onCancelEdit={handleCancelEditCategory}
                onDeleteClick={handleDeleteCategoryClick}
              />
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={() => { setEditingCategory(null); setEditedCategoryName(""); }}>
                Cerrar
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
                Esta acción no se puede deshacer. Se eliminará la categoría
                "{categoryToDelete?.name}" permanentemente. Las transacciones existentes
                con esta categoría no se modificarán.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCategoryToDelete(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDeleteCategory}>
                Eliminar
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};


const CategoryManagerList = ({ type, categories, onEdit, editingCategory, editedCategoryName, onNameChange, onSaveEdit, onCancelEdit, onDeleteClick }) => {
  if (categories.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-4">No hay categorías personalizadas de {type === 'income' ? 'ingresos' : 'gastos'}.</p>;
  }

  return (
    <div className="space-y-2 max-h-[300px] overflow-y-auto p-1">
      {categories.map(cat => (
        <div key={cat} className="flex items-center justify-between p-2 border rounded-md bg-background hover:bg-muted/50">
          {editingCategory && editingCategory.type === type && editingCategory.oldName === cat ? (
            <div className="flex-grow flex items-center gap-2">
              <Input 
                value={editedCategoryName}
                onChange={(e) => onNameChange(e.target.value)}
                className="h-8 text-sm"
              />
              <Button size="sm" onClick={onSaveEdit} className="h-8"><Save className="h-4 w-4" /></Button>
              <Button variant="outline" size="sm" onClick={onCancelEdit} className="h-8"><XCircle className="h-4 w-4" /></Button>
            </div>
          ) : (
            <>
              <span className="text-sm flex-grow">{cat}</span>
              <div className="flex items-center gap-1 shrink-0">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(type, cat)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDeleteClick(type, cat)}>
                  <Trash2 className="h-4 w-4 text-destructive hover:text-destructive/80" />
                </Button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};


export default BudgetForm;
