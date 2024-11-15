"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

// Define interfaces for user, user analytics, product, order, and coupon details
interface User {
  user_id: string;
  email: string;
  amount_spent: number;
  user_role: string;
}

interface UserAnalytics {
  users: User[];
  userCount: number;
  newUserCount: number;
  activeUserCount: number;
  inactiveUserCount: number;
}

interface Product {
  item_id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  available_stock: number;
  document_url?: string;
}

interface OrderItem {
  quantity: number;
  price: number;
  product: {
    price: number;
    title: string;
    category: string;
  };
}

interface Order {
  order_id: number;
  user: {
    full_name: string;
    email: string;
  };
  order_date: string;
  total_amount: number;
  payment_status: string;
  items: OrderItem[];
  coupon: Coupon | null;
}

interface OrderAnalytics {
  orderCount: number;
  orders: Order[];
}

interface Coupon {
title: string;
description : string;
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

// Define the main dashboard data structure
interface DashboardData {
  userAnalytics: UserAnalytics | null;
  products: Product[];
  orders: OrderAnalytics | null;
  coupons: Coupon[];
  updateUserAnalytics: (data: UserAnalytics) => void;
  updateProducts: (data: Product[]) => void;
  updateOrders: (data: OrderAnalytics) => void;
  updateCoupons: (data: Coupon[]) => void;
}

// Initialize the context with a default value
const DashboardContext = createContext<DashboardData>({
  userAnalytics: null,
  products: [],
  orders: null,
  coupons: [],
  updateUserAnalytics: () => {},
  updateProducts: () => {},
  updateOrders: () => {},
  updateCoupons: () => {},
});

// Define the provider component to fetch and store dashboard data
export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics | null>(
    null
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<OrderAnalytics | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [userRes, orderRes, productRes, couponRes] = await Promise.all([
          fetch("http://localhost:8000/api/v1/analytics/users"),
          fetch("http://localhost:8000/api/v1/analytics/orders"),
          fetch("http://localhost:8000/api/v1/products"),
          fetch("http://localhost:8000/api/v1/coupons"),
        ]);

        const userData = await userRes.json();
        const orderData = await orderRes.json();
        const productData = await productRes.json();
        const couponData = await couponRes.json();

        setUserAnalytics(userData);
        setProducts(productData);
        setOrders(orderData);
        setCoupons(couponData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const updateUserAnalytics = (data: UserAnalytics) => setUserAnalytics(data);
  const updateProducts = (data: Product[]) => setProducts(data);
  const updateOrders = (data: OrderAnalytics) => setOrders(data);
  const updateCoupons = (data: Coupon[]) => setCoupons(data);

  // Return the context provider with values and update functions
  return (
    <DashboardContext.Provider
      value={{
        userAnalytics,
        products,
        orders,
        coupons,
        updateUserAnalytics,
        updateProducts,
        updateOrders,
        updateCoupons,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

// Custom hook for using dashboard data
export const useDashboardData = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboardData must be used within a DashboardProvider");
  }
  return context;
};
