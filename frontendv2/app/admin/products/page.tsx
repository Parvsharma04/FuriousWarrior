"use client";

import EditProductForm from "@/components/EditProductForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useDashboardData } from "@/context/DashboardContext";
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

const ITEMS_PER_PAGE = 9; // 3x3 grid

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();
  const { products: contextProducts } = useDashboardData();
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>(contextProducts);
  const [editForm, setEditForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setProducts(contextProducts);
  }, [contextProducts]);

  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setEditForm(true);
  };

  const handleSave = async (updatedProduct: Product) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/products/${updatedProduct.item_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProduct),
        }
      );
      const data = await response.json();

      toast({
        title: "Success",
        description: data.message,
        variant: "default",
      });

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.item_id === updatedProduct.item_id ? updatedProduct : product
        )
      );
      setEditProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description: "Error updating product",
        variant: "destructive",
      });
    }
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
      toast({
        title: "Success",
        description: data.message,
        variant: "default",
      });

      // Remove the deleted product from the local state
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.item_id !== id)
      );
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
    setEditForm(false);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
              className="mt-1 lg:hidden"
            />
            <Input
              id="search-lg"
              type="text"
              placeholder="Search by title or description"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-1 hidden lg:block"
            />
          </div>
          <Button onClick={handleOpenForm} className="ml-2 md:mt-7 mt-[50px]">
            <Plus className="w-4 h-4 mr-2" />
            Add New Product
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentProducts.map((product) => (
            <ProductCard
              key={product.item_id}
              product={product}
              handleEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
        {totalPages > 1 && (
          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    onClick={() => handlePageChange(index + 1)}
                    isActive={currentPage === index + 1}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
        {showForm && <AddProductForm onClose={handleCloseForm} />}
        {editForm && (
          <EditProductForm
            onClose={handleCloseForm}
            product={editProduct}
            onSave={handleSave}
          />
        )}
      </CardContent>
    </Card>
  );
}
