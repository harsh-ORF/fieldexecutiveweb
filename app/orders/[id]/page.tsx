import { getOrder } from "@/lib/supabase";
import { OrderDetailsClient } from "./order-details-client";

export const dynamic = "force-dynamic";

export default async function OrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const order = await getOrder(params.id);

  return <OrderDetailsClient initialOrder={order} params={params} />;
}
