"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type Product = {
  item_id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  available_stock: number;
  document_url?: string;
};

interface EditProductFormProps {
  product: Product | null;
  onSave: (updatedProduct: Product) => void;
  onClose: () => void;
}

interface FormData {
  title: string;
  description: string;
  price: number;
  category: string;
  available_stock: number;
  document?: FileList;
}

export default function EditProductForm({
  product,
  onSave,
  onClose,
}: EditProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const categories = [
    "DOCUMENT",
    "SERVICE",
    "CONSULTANCY",
    "TRAINING",
    "PRODUCT",
    "ADVERTISING",
  ];

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  // Pre-fill form with existing product data if product is not null
  useEffect(() => {
    if (product) {
      setValue("title", product.title);
      setValue("description", product.description);
      setValue("price", product.price);
      setValue("category", product.category);
      setValue("available_stock", product.available_stock);
    }
  }, [product, setValue]);

  // If product is null, close the form immediately
  if (!product) {
    onClose();
    return null;
  }

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("price", data.price.toString());
      formData.append("category", data.category);
      formData.append("available_stock", data.available_stock.toString());
      if (data.document && data.document[0]) {
        formData.append("document", data.document[0]);
      }

      const response = await fetch(
        `http://localhost:8000/api/v1/products/${product.item_id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update product");
      }

      const updatedProduct = await response.json();
      onSave(updatedProduct);

      toast({
        title: "Success",
        description: "Product updated successfully",
      });
      onClose();
    } catch (error) {
      console.error("Failed to update product:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred while updating the product",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && (
                <p className="text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description", {
                  required: "Description is required",
                })}
              />
              {errors.description && (
                <p className="text-red-500">{errors.description.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                type="number"
                step="0.01"
                id="price"
                {...register("price", {
                  required: "Price is required",
                  min: {
                    value: 0.01,
                    message: "Price must be a positive value",
                  },
                })}
              />
              {errors.price && (
                <p className="text-red-500">{errors.price.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                onValueChange={(value) => setValue("category", value)}
                defaultValue={product.category}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-red-500">{errors.category.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="available_stock">Available Stock</Label>
              <Input
                type="number"
                id="available_stock"
                {...register("available_stock", {
                  required: "Available stock is required",
                  min: {
                    value: 1,
                    message: "Stock must be a positive integer",
                  },
                })}
              />
              {errors.available_stock && (
                <p className="text-red-500">{errors.available_stock.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="document">Document</Label>
              <Input type="file" id="document" {...register("document")} />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
