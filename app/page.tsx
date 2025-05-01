"use client";

import { useState } from "react";
import Link from "next/link";
import { Order } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { OrderTable } from "@/components/order-table";
import { NavBar } from "@/components/nav-bar";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleOrderClick = (order: Order) => {
    router.push(`/orders/${order.id}`);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="flex flex-col gap-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Orders
          </h1>
          <OrderTable onOrderClick={handleOrderClick} />
        </div>
      </main>
    </div>
  );
}
