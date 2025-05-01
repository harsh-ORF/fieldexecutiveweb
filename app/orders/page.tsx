import { getOrders } from "@/lib/supabase";
import { OrderList } from "@/components/order-list";
import { OrderSearch } from "@/components/order-search";

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold">Orders</h1>
        <OrderSearch />
      </div>
      <OrderList orders={orders} />
    </div>
  );
}
