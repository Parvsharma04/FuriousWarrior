"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import AddProductForm from "../../../components/AddProductForm";
import ProductCard from "../../../components/ProductCard";

type Product = {
  item_id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  available_stock: number;
  document_url?: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/products");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleEdit = (id: string) => {
    // Implement edit functionality
    console.log("Edit product", id);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/products/${id}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      fetchProducts(); // Refresh the product list
      toast({
        title: "Success",
        description: data.message,
        variant: "default",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Error deleting product",
        variant: "destructive",
      });
    }
  };

  const handleOpenForm = () => setShowForm(true);
  const handleCloseForm = () => {
    setShowForm(false);
    fetchProducts(); // Refresh the product list after adding a new product
  };

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Product Management</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          Here you can add, edit, or remove products from your inventory.
        </p>
        <div className="flex justify-between items-center mb-6">
          <div className="w-full">
            <Label htmlFor="search">Search Products</Label>
            <Input
              id="search"
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-1 lg:hidden" // Only visible on smaller screens
            />

            <Input
              id="search-lg"
              type="text"
              placeholder="Search by title or description"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-1 hidden lg:block" // Visible on large screens and above
            />
          </div>
          <Button onClick={handleOpenForm} className="ml-2 mt-7">
            <Plus className="w-4 h-4 mr-2" />
            Add New Product
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.item_id}
              product={product}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
        {showForm && <AddProductForm onClose={handleCloseForm} />}
      </CardContent>
    </Card>
  );
}
