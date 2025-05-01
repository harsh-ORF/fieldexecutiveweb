"use client";

import { Order } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, User } from "lucide-react";
import Link from "next/link";

interface OrderListProps {
  orders: Order[];
}

export function OrderList({ orders }: OrderListProps) {
  // Filter out completed orders
  const filteredOrders = orders.filter((order) => order.status !== "completed");

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredOrders.map((order) => (
        <Link key={order.id} href={`/orders/${order.id}`}>
          <Card className="h-full transition-colors hover:bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{order.buyer?.full_name || "Unknown Buyer"}</span>
                </div>
                <Badge variant="outline">{order.status}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{order.region?.name || "No Region"}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Seller: {order.seller?.full_name || "Unknown Seller"}
                </div>
                <div className="text-sm text-muted-foreground">
                  Created: {new Date(order.created_at).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
