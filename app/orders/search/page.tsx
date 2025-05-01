import { Suspense } from "react";
import { getOrders, Order } from "@/lib/supabase";
import { OrderSearch } from "@/components/order-search";
import { OrderList } from "@/components/order-list";
import { SearchParams } from "@/types";

interface SearchPageProps {
  searchParams: SearchParams;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const searchQuery = searchParams.query as string;
  const orders = await getOrders();

  // Filter orders based on search query
  const filteredOrders = orders.filter((order) => {
    const searchTerm = searchQuery?.toLowerCase() || "";
    return (
      (order.buyer?.full_name?.toLowerCase() || "").includes(searchTerm) ||
      (order.seller?.full_name?.toLowerCase() || "").includes(searchTerm) ||
      (order.region?.name?.toLowerCase() || "").includes(searchTerm)
    );
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Search Orders</h1>
      <OrderSearch />
      <OrderList orders={filteredOrders} />
    </div>
  );
}
