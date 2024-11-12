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

interface AddProductFormProps {
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

export default function AddProductForm({ onClose }: AddProductFormProps) {
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
    reset,
    formState: { errors },
    setValue,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      let response;
      if (data.document && data.document[0]) {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("price", data.price.toString());
        formData.append("category", data.category);
        formData.append("available_stock", data.available_stock.toString());
        formData.append("document", data.document[0]);

        response = await fetch("http://localhost:8000/api/v1/products", {
          method: "POST",
          body: formData,
        });
      } else {
        response = await fetch("http://localhost:8000/api/v1/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: data.title,
            description: data.description,
            price: data.price,
            category: data.category,
            available_stock: data.available_stock,
          }),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to create product:", errorData);
        return;
      }

      reset();
      onClose();
    } catch (error) {
      console.error("Failed to create product:", error);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
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
                  pattern: {
                    value: /^[0-9]+(\.[0-9]{1,2})?$/,
                    message:
                      "Price must be a positive number with up to two decimal places",
                  },
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
              <Select onValueChange={(value) => setValue("category", value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    {categories.map((category, index) => (
                      <SelectItem key={index} value={category}>
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
                  pattern: {
                    value: /^[1-9][0-9]*$/,
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
            <Button type="submit">Submit</Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
