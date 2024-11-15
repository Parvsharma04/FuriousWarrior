"use client";

import { useDashboardData } from "@/context/DashboardContext";
import { toast } from "@/hooks/use-toast";
import * as ScrollArea from "@radix-ui/react-scroll-area";
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
} from "../components/ui/select";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea"; // Ensure you have a Textarea component

interface Coupon {
  title: string;
  description: string;
  coupon_id: number;
  code: string;
  discount_amount: number;
  discount_percent: number | null;
  start_date: string;
  end_date: string;
  max_uses: number;
  times_used: number;
  type: string;
  applicable_products: string[]; // Applicable product IDs
  valid: boolean;
}

interface AddCouponFormProps {
  onClose: () => void;
  editCoupon?: Coupon | null;
}

export default function AddCouponForm({
  onClose,
  editCoupon = null,
}: AddCouponFormProps) {
  const { products, coupons, updateCoupons } = useDashboardData();
  const { register, handleSubmit, setValue, watch, reset } = useForm<Coupon>({
    defaultValues: editCoupon || {
      title: "",
      description: "",
      code: "",
      discount_amount: 0,
      discount_percent: null,
      start_date: "",
      end_date: "",
      max_uses: 1,
      times_used: 0,
      type: "PRODUCT", // Default type to PRODUCT
      applicable_products: [],
      valid: true,
    },
  });

  const watchApplicableProducts = watch("applicable_products");
  const [selectAll, setSelectAll] = useState(false);

  const toggleSelectAll = () => {
    const allProductIds = products.map((product) => product.item_id);
    if (selectAll) {
      setValue("applicable_products", []);
    } else {
      setValue("applicable_products", allProductIds);
    }
    setSelectAll(!selectAll);
  };

  // Effect to reset form fields when switching between create and edit modes
  useEffect(() => {
    if (editCoupon) {
      reset(editCoupon); // Reset the form when editing a coupon
    } else {
      reset({
        title: "",
        description: "",
        code: "",
        discount_amount: 0,
        discount_percent: null,
        start_date: "",
        end_date: "",
        max_uses: 1,
        times_used: 0,
        type: "ORDER", // Default to PRODUCT
        applicable_products: [],
        valid: true,
      });
    }
  }, [editCoupon, reset]);

  const onSubmit = async (data: Coupon) => {
    console.log(data);
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/coupons${
          editCoupon ? `/${data.coupon_id}` : ""
        }`,
        {
          method: editCoupon ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
            applicable_products:
              data.type === "ORDER" ? ["ORDER"] : data.applicable_products,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save coupon");
      }

      const updatedCoupons = editCoupon
        ? coupons.map((c) =>
            c.coupon_id === data.coupon_id ? { ...c, ...data } : c
          )
        : [...coupons, data];

      updateCoupons(updatedCoupons);
      toast({
        title: "Success",
        description: `Coupon ${editCoupon ? "updated" : "added"} successfully.`,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save coupon",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent
        className="max-w-md w-full p-4 overflow-hidden rounded-lg"
        style={{ maxHeight: "90vh" }} // Limit height for smaller screens
      >
        <DialogHeader>
          <DialogTitle>
            {editCoupon ? "Edit Coupon" : "Add New Coupon"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea.Root className="h-[75vh] overflow-y-auto">
          <ScrollArea.Viewport>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  {...register("title", { required: true })}
                  placeholder="Enter coupon title"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register("description", { required: true })}
                  placeholder="Enter coupon description"
                />
              </div>
              <div>
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  {...register("code", { required: true })}
                  placeholder="Enter coupon code"
                />
              </div>
              <div>
                <Label htmlFor="discount_amount">Discount Amount</Label>
                <Input
                  id="discount_amount"
                  type="number"
                  {...register("discount_amount", { required: true, min: 0 })}
                  placeholder="e.g., 20.00"
                />
              </div>
              <div>
                <Label htmlFor="discount_percent">Discount Percent</Label>
                <Input
                  id="discount_percent"
                  type="number"
                  {...register("discount_percent")}
                  placeholder="e.g., 10"
                />
              </div>
              <div>
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  {...register("start_date", { required: true })}
                />
              </div>
              <div>
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  {...register("end_date", { required: true })}
                />
              </div>
              <div>
                <Label htmlFor="max_uses">Max Uses</Label>
                <Input
                  id="max_uses"
                  type="number"
                  {...register("max_uses", { required: true, min: 1 })}
                />
              </div>
              <div>
                <Label htmlFor="type">Coupon Type</Label>
                <Select
                  {...register("type", { required: true })}
                  onValueChange={(value) => {
                    setValue("type", value);
                    // Reset applicable products when switching to ORDER
                    if (value === "ORDER") {
                      setValue("applicable_products", []);
                    }
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Categories</SelectLabel>
                      <SelectItem value="ORDER">Order</SelectItem>
                      <SelectItem value="PRODUCT">Product</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              {watch("type") === "PRODUCT" && (
                <div>
                  <div className="flex items-center justify-between">
                    <Label>Applicable Products</Label>
                    <Checkbox
                      id="select-all"
                      checked={selectAll}
                      onCheckedChange={toggleSelectAll}
                      className="hidden"
                    />
                    <label htmlFor="select-all" className="text-sm font-medium">
                      Select All
                    </label>
                  </div>
                  <ScrollArea.Root className="h-32 w-full rounded-md border">
                    <ScrollArea.Viewport className="px-2 py-1">
                      {products.map((product) => (
                        <div
                          key={product.item_id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`product-${product.item_id}`}
                            checked={watchApplicableProducts.includes(
                              product.item_id
                            )}
                            onCheckedChange={() => {
                              const current = watchApplicableProducts || [];
                              const newProducts = current.includes(
                                product.item_id
                              )
                                ? current.filter((id) => id !== product.item_id)
                                : [...current, product.item_id];
                              setValue("applicable_products", newProducts);
                            }}
                          />
                          <label
                            htmlFor={`product-${product.item_id}`}
                            className="text-sm font-medium"
                          >
                            {product.title}
                          </label>
                        </div>
                      ))}
                    </ScrollArea.Viewport>
                  </ScrollArea.Root>
                </div>
              )}
              <DialogFooter>
                <Button type="submit">
                  {editCoupon ? "Update" : "Create"} Coupon
                </Button>
                <Button type="button" variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
              </DialogFooter>
            </form>
          </ScrollArea.Viewport>
        </ScrollArea.Root>
      </DialogContent>
    </Dialog>
  );
}
