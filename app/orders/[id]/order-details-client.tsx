"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getOrder, Order } from "@/lib/supabase";
import { NavBar } from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2, Calendar, User, MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { MediaUpload } from "@/components/media-upload";
import { MediaGallery } from "@/components/media-gallery";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { toast } from "sonner";
import { DailyLoadingInput } from "@/components/daily-loading-input";
import { supabase } from "@/lib/supabase";

interface OrderDetailsClientProps {
  params: {
    id: string;
  };
  initialOrder: Order | null;
}

export function OrderDetailsClient({
  params,
  initialOrder,
}: OrderDetailsClientProps) {
  const [order, setOrder] = useState<Order | null>(initialOrder);
  const [loading, setLoading] = useState(!initialOrder);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (!initialOrder) {
      const fetchOrder = async () => {
        setLoading(true);
        try {
          const data = await getOrder(params.id);
          setOrder(data);
        } catch (error) {
          console.error("Error fetching order:", error);
          toast.error("Failed to load order details");
        } finally {
          setLoading(false);
        }
      };

      fetchOrder();
    }
  }, [params.id, initialOrder]);

  const handleMediaUploadSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-1 container py-12 flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold">Order not found</h1>
          <p className="text-muted-foreground">
            The order you're looking for doesn't exist or you don't have
            permission to view it.
          </p>
          <Button onClick={() => router.push("/")}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1">
        <div className="container px-4 py-4">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-2">
              <Button
                variant="ghost"
                className="flex h-8 items-center gap-1 px-2 text-muted-foreground -ml-2 w-fit"
                onClick={() => router.push("/")}
              >
                <ChevronLeft className="h-4 w-4" />
                Back to orders
              </Button>
              <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight">
                  Order Details
                </h1>
                <p className="text-sm text-muted-foreground">
                  Manage media for this order
                </p>
              </div>
            </div>

            {/* Order Information */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Order Information</CardTitle>
                <CardDescription>
                  Basic information about the order
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6">
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Created Date
                      </p>
                      <p className="font-medium">
                        {format(new Date(order.created_at), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Seller
                      </p>
                      <p className="font-medium">
                        {order.seller?.full_name || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Region
                      </p>
                      <p className="font-medium">
                        {order.region?.name || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Media Upload */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Upload Media</CardTitle>
                <CardDescription>
                  Add images related to this order
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6">
                <MediaUpload
                  orderId={order.id}
                  onSuccess={handleMediaUploadSuccess}
                />
              </CardContent>
            </Card>

            {/* Daily Loading Input */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Loading Progress</CardTitle>
                <CardDescription>
                  Add daily loading quantities for this order
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6">
                <DailyLoadingInput
                  dailyLoading={order.daily_loading || []}
                  orderId={order.id}
                  onUpdate={async (newLoading) => {
                    try {
                      const { error } = await supabase
                        .from("orders")
                        .update({ daily_loading: newLoading })
                        .eq("id", order.id);

                      if (error) throw error;

                      // Refresh the order data
                      const updatedOrder = await getOrder(order.id);
                      setOrder(updatedOrder);
                      toast.success("Loading data updated successfully");
                    } catch (error) {
                      console.error("Error updating loading data:", error);
                      toast.error("Failed to update loading data");
                    }
                  }}
                />
              </CardContent>
            </Card>

            {/* Media Gallery */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Order Media</CardTitle>
                <CardDescription>
                  View all media associated with this order
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6">
                <MediaGallery
                  orderId={order.id}
                  refreshTrigger={refreshTrigger}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
