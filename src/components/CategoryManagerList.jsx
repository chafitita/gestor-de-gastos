"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function CategoryManagerList({ type = "income", onChange }) {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/categories?type=${type}`);
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      toast.error("Error al obtener categorías");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [type]);

  const handleAdd = async () => {
    if (!name.trim()) return;

    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3001/api/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, type }),
      });

      if (!res.ok) throw new Error("Error al agregar categoría");

      setName("");
      fetchCategories();
      toast.success("Categoría agregada");

      if (onChange) onChange();
    } catch (err) {
      toast.error("Error al guardar categoría");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/api/categories/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error al eliminar categoría");

      toast.success("Categoría eliminada");
      fetchCategories();

      if (onChange) onChange();
    } catch (err) {
      toast.error("No se pudo eliminar la categoría");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="new-category">Nueva categoría</Label>
        <div className="flex gap-2 mt-2">
          <Input
            id="new-category"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button onClick={handleAdd} disabled={loading}>
            Agregar
          </Button>
        </div>
      </div>

      <div>
        <Label>Categorías actuales</Label>
        <ul className="mt-2 space-y-2">
          {categories.map((cat) => (
            <li key={cat.id} className="flex justify-between items-center p-2 border rounded">
              <span>{cat.name}</span>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(cat.id)}>
                Eliminar
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
