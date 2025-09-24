"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import CategoryManagerList from "./CategoryManagerList";
import { toast } from "sonner";

const formSchema = z.object({
  amount: z.coerce.number().min(1, "El monto debe ser mayor a 0."),
  type: z.enum(["income", "expense"], { required_error: "Selecciona un tipo" }),
  category: z.string().min(1, "Selecciona una categoría válida"),
});

export default function BudgetForm({ year, month }) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      type: "income",
      category: "",
    },
  });

  const [categories, setCategories] = React.useState({ income: [], expense: [] });
  const [loading, setLoading] = React.useState(false);
  const type = watch("type");

  const fetchCategories = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/categories?type=${type}`);
      const data = await res.json();
      setCategories((prev) => ({ ...prev, [type]: data }));
    } catch (err) {
      toast.error("Error al cargar categorías");
    }
  };

  React.useEffect(() => {
    fetchCategories();
    setValue("category", "");
  }, [type]);

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3001/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          year,
          month,
        }),
      });

      if (!res.ok) throw new Error("Error al añadir transacción");
      toast.success("Transacción añadida");
      reset();
      fetchCategories();
    } catch (error) {
      toast.error("Error al enviar datos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-md shadow max-w-md w-full">
      <h2 className="text-xl font-semibold">Añadir Transacción</h2>

      <div>
        <Label>Monto</Label>
        <Input type="number" {...register("amount")} />
        {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
      </div>

      <div>
        <Label>Tipo</Label>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <RadioGroup defaultValue={field.value} onValueChange={field.onChange} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="income" id="income" />
                <Label htmlFor="income">Ingreso</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="expense" id="expense" />
                <Label htmlFor="expense">Gasto</Label>
              </div>
            </RadioGroup>
          )}
        />
      </div>

      <div>
        <Label>Categoría</Label>
        <div className="flex gap-2 mb-2">
          <Button type="button" variant="secondary" size="sm" onClick={fetchCategories}>
            Nueva
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">Gestionar</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Gestionar Categorías</DialogTitle>
                <DialogDescription>Editá o eliminá tus categorías personalizadas.</DialogDescription>
              </DialogHeader>
              <CategoryManagerList type={type} onChange={fetchCategories} />
            </DialogContent>
          </Dialog>
        </div>

        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories[type]?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Cargando..." : "➕ Añadir"}
      </Button>
    </form>
  );
}
