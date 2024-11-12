"use client";
import { useState } from "react";
import AddProductForm from "./AddProductForm";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function ProductsContent() {
  const [showForm, setShowForm] = useState(false);

  const handleOpenForm = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Management</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Here you can add, edit, or remove products from your inventory.</p>
        <Button onClick={handleOpenForm} className="mt-4">
          Add New Product
        </Button>

        {showForm && <AddProductForm onClose={handleCloseForm} />}
      </CardContent>
    </Card>
  );
}
