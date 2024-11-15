"use client";

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
import { format } from "date-fns";
import { Pencil, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import AddCouponForm from "./AddCouponForm";

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
  applicable_products: string[];
  valid: boolean;
}

const ITEMS_PER_PAGE = 10;

export default function CouponsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const { toast } = useToast();
  const { coupons: contextCoupons, products: contextProducts } =
    useDashboardData();

  const [editCoupon, setEditCoupon] = useState<Coupon | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>(contextCoupons); // Local state for coupons
  const [currentPage, setCurrentPage] = useState(1);

  const [formData, setFormData] = useState<
    Omit<Coupon, "coupon_id" | "times_used">
  >({
    title: "",
    description: "",
    code: "",
    discount_amount: 0,
    discount_percent: null,
    start_date: "",
    end_date: "",
    max_uses: 0,
    applicable_products: [],
    valid: true,
  });

  useEffect(() => {
    setCoupons(contextCoupons); // Sync local state with context
  }, [contextCoupons]);

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({ ...prev, [name]: value }));
  // };

  // const handleProductSelection = (productId: string) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     applicable_products: prev.applicable_products.includes(productId)
  //       ? prev.applicable_products.filter((id) => id !== productId)
  //       : [...prev.applicable_products, productId],
  //   }));
  // };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     const response = await fetch("http://localhost:8000/api/v1/coupons", {
  //       method: editCoupon ? "PUT" : "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(
  //         editCoupon
  //           ? { ...formData, coupon_id: editCoupon.coupon_id }
  //           : formData
  //       ),
  //     });
  //     const data = await response.json();

  //     if (response.ok) {
  //       toast({
  //         title: "Success",
  //         description: editCoupon
  //           ? "Coupon updated successfully"
  //           : "Coupon created successfully",
  //       });

  //       if (editCoupon) {
  //         // Update coupon in local state
  //         setCoupons((prev) =>
  //           prev.map((coupon) =>
  //             coupon.coupon_id === editCoupon.coupon_id
  //               ? { ...coupon, ...formData }
  //               : coupon
  //           )
  //         );
  //       } else {
  //         // Add new coupon to local state
  //         setCoupons((prev) => [...prev, data.coupon]);
  //       }

  //       // Close form and reset
  //       setShowForm(false);
  //       setEditCoupon(null);
  //     } else {
  //       throw new Error(data.message || "Failed to save coupon");
  //     }
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description:
  //         error instanceof Error ? error.message : "An error occurred",
  //       variant: "destructive",
  //     });
  //   }
  // };

  const handleEdit = (coupon: Coupon) => {
    setEditCoupon(coupon);
    setFormData({
      title: coupon.title,
      description: coupon.description,
      code: coupon.code,
      discount_amount: coupon.discount_amount,
      discount_percent: coupon.discount_percent,
      start_date: coupon.start_date,
      end_date: coupon.end_date,
      max_uses: coupon.max_uses,
      applicable_products: coupon.applicable_products,
      valid: true,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/coupons/${id}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Coupon deleted successfully",
        });
        // Remove coupon from local state
        setCoupons((prev) => prev.filter((coupon) => coupon.coupon_id !== id));
      } else {
        throw new Error(data.message || "Failed to delete coupon");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleOpenForm = () => setShowForm(true);
  const handleCloseForm = () => {
    setShowForm(false);
    setEditForm(false);
  };

  const filteredCoupons = coupons.filter((coupon) =>
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCoupons.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCoupons = filteredCoupons.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Coupon Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Here you can add, edit, or remove coupons for your products and
            services.
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
                placeholder="Search by title"
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left p-2">Code</th>
                  <th className="text-left p-2">Discount</th>
                  <th className="text-left p-2">Valid Period</th>
                  <th className="text-left p-2">Uses</th>
                  <th className="text-left p-2">Applicable Products</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentCoupons.map((coupon) => (
                  <tr key={coupon.coupon_id} className="border-t">
                    <td className="p-2">{coupon.code}</td>
                    <td className="p-2">
                      {coupon.discount_percent
                        ? `${coupon.discount_percent}%`
                        : `$${coupon.discount_amount.toFixed(2)}`}
                    </td>
                    <td className="p-2">
                      {format(new Date(coupon.start_date), "MM/dd/yyyy")} -
                      {format(new Date(coupon.end_date), "MM/dd/yyyy")}
                    </td>
                    <td className="p-2">
                      {coupon.times_used} / {coupon.max_uses}
                    </td>
                    <td className="p-2">
                      {coupon.applicable_products.length} products
                    </td>
                    <td className="p-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(coupon)}
                        className="mr-2"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(coupon.coupon_id)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <Pagination className="mt-6">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
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
        </CardContent>
      </Card>
      {showForm && <AddCouponForm onClose={handleCloseForm} />}
    </>
  );
}
