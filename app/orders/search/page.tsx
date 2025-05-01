import { Suspense } from "react";
import { getOrders } from "@/lib/supabase";
import { OrderSearch } from "@/components/order-search";
import { OrderList } from "@/components/order-list";
import { SearchParams } from "@/types";

interface SearchPageProps {
  searchParams: SearchParams;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const searchQuery = searchParams.q as string;
  const orders = await getOrders();

  // Filter orders based on search query
  const filteredOrders = orders.filter((order) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      order.buyer?.name?.toLowerCase().includes(searchTerm) ||
      order.seller?.name?.toLowerCase().includes(searchTerm) ||
      order.region?.name?.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold">Search Orders</h1>
        <OrderSearch />
      </div>

      {searchQuery && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            Search Results for "{searchQuery}"
          </h2>
          <Suspense fallback={<div>Loading...</div>}>
            {filteredOrders.length > 0 ? (
              <OrderList orders={filteredOrders} />
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No orders found matching your search.
                </p>
              </div>
            )}
          </Suspense>
        </div>
      )}
    </div>
  );
}
