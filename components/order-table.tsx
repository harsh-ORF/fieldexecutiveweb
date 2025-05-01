"use client";

import { useState, useEffect } from "react";
import { Order, getOrders } from "@/lib/supabase";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, ChevronDown, ChevronUp, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderTableProps {
  onOrderClick?: (order: Order) => void;
}

export function OrderTable({ onOrderClick }: OrderTableProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Order;
    direction: "asc" | "desc";
  } | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        console.log("Fetching orders...");
        const data = await getOrders();
        console.log("Orders fetched:", data);
        setOrders(data);
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const handleSort = (key: keyof Order) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<
      string,
      {
        label: string;
        variant: "default" | "secondary" | "destructive" | "outline";
      }
    > = {
      pending: { label: "Pending", variant: "secondary" },
      approved: { label: "Approved", variant: "default" },
      rejected: { label: "Rejected", variant: "destructive" },
      completed: { label: "Completed", variant: "default" },
      loading_initiated: { label: "Loading Initiated", variant: "outline" },
      loading_started: { label: "Loading Started", variant: "outline" },
      loading_stopped: { label: "Loading Stopped", variant: "outline" },
      loading_completed: { label: "Loading Completed", variant: "outline" },
    };

    const statusInfo = statusMap[status] || {
      label: status,
      variant: "secondary",
    };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const getNutQualityBadge = (quality: string) => {
    const qualityMap: Record<
      string,
      { label: string; variant: "default" | "secondary" | "outline" }
    > = {
      single_filter: { label: "Single Filter", variant: "default" },
      double_filter: { label: "Double Filter", variant: "secondary" },
      mixed_filter: { label: "Mixed Filter", variant: "outline" },
    };

    const qualityInfo = qualityMap[quality] || {
      label: quality,
      variant: "secondary",
    };
    return <Badge variant={qualityInfo.variant}>{qualityInfo.label}</Badge>;
  };

  const renderRating = (rating: number | null | undefined) => {
    if (rating === null || rating === undefined) return "N/A";
    return (
      <div className="flex items-center gap-1">
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        <span>{rating.toFixed(1)}</span>
      </div>
    );
  };

  const sortedAndFilteredOrders = orders
    .filter((order) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        (order.buyer?.full_name?.toLowerCase() || "").includes(searchLower) ||
        (order.seller?.full_name?.toLowerCase() || "").includes(searchLower) ||
        (order.region?.name?.toLowerCase() || "").includes(searchLower) ||
        order.nut_quality.toLowerCase().includes(searchLower) ||
        String(order.quantity).toLowerCase().includes(searchLower) ||
        (order.truck_details &&
          order.truck_details.length > 0 &&
          (order.truck_details[0].truck_number
            .toLowerCase()
            .includes(searchLower) ||
            order.truck_details[0].driver_name
              .toLowerCase()
              .includes(searchLower) ||
            order.truck_details[0].driver_number
              .toLowerCase()
              .includes(searchLower)))
      );
    })
    .sort((a, b) => {
      if (!sortConfig) return 0;
      const { key, direction } = sortConfig;
      const aValue = a[key];
      const bValue = b[key];

      if (aValue != null && bValue != null) {
        if (aValue < bValue) return direction === "asc" ? -1 : 1;
        if (aValue > bValue) return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative w-full max-w-sm mx-auto sm:mx-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by buyer, seller, region, truck, driver, quantity..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-8"
        />
      </div>

      {/* Mobile View - Cards */}
      <div className="block sm:hidden space-y-4">
        {sortedAndFilteredOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No orders found</div>
        ) : (
          sortedAndFilteredOrders.map((order) => (
            <div
              key={order.id}
              className="relative rounded-lg border-2 border-gray-400 p-4 space-y-3 cursor-pointer transition-colors duration-200 hover:border-primary hover:shadow-sm bg-background"
              onClick={() => onOrderClick?.(order)}
            >
              {/* Main Details Section */}
              <div className="space-y-3 mb-2">
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium text-muted-foreground">
                      Seller
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(order.created_at), "MMM dd, yyyy")}
                    </span>
                  </div>
                  <div className="font-bold text-lg">
                    {order.seller?.full_name || "N/A"}
                  </div>
                </div>
                <div className="flex gap-2 items-center text-sm">
                  <span className="font-semibold">Region:</span>
                  <span>{order.region?.name || "N/A"}</span>
                </div>
              </div>
              <hr className="my-2 border-muted-foreground/20" />
              {/* Secondary Details Section */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    Quantity (Tons)
                  </span>
                  <span>{order.quantity ?? "N/A"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    Nut Quality
                  </span>
                  <span>{getNutQualityBadge(order.nut_quality)}</span>
                </div>
                {order.truck_details && order.truck_details.length > 0 && (
                  <div className="pt-2">
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      Truck
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span>
                        <span className="font-semibold">Number:</span>{" "}
                        {order.truck_details[0].truck_number}
                      </span>
                      <span>
                        <span className="font-semibold">Driver:</span>{" "}
                        {order.truck_details[0].driver_name} (
                        {order.truck_details[0].driver_number})
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop View - Table */}
      <div className="hidden sm:block rounded-md border overflow-x-auto">
        <div className="min-w-[950px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer whitespace-nowrap"
                  onClick={() => handleSort("created_at")}
                >
                  <div className="flex items-center gap-1">
                    Created Date
                    {sortConfig?.key === "created_at" &&
                      (sortConfig.direction === "asc" ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
                <TableHead className="whitespace-nowrap font-bold">
                  Buyer Name
                </TableHead>
                <TableHead className="whitespace-nowrap font-bold">
                  Seller Name
                </TableHead>
                <TableHead className="whitespace-nowrap">Region</TableHead>
                <TableHead className="whitespace-nowrap">
                  Quantity (Tons)
                </TableHead>
                <TableHead className="whitespace-nowrap">Nut Quality</TableHead>
                <TableHead className="whitespace-nowrap">Truck</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAndFilteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-gray-500"
                  >
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                sortedAndFilteredOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    className={cn(
                      "cursor-pointer transition-colors duration-200 hover:bg-primary/5",
                      onOrderClick && "cursor-pointer"
                    )}
                    onClick={() => onOrderClick?.(order)}
                  >
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(order.created_at), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-medium">
                      {order.buyer?.full_name || "N/A"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-medium">
                      {order.seller?.full_name || "N/A"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {order.region?.name || "N/A"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {order.quantity ?? "N/A"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {getNutQualityBadge(order.nut_quality)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {order.truck_details && order.truck_details.length > 0 ? (
                        <>
                          <span className="font-semibold">
                            {order.truck_details[0].truck_number}
                          </span>
                          <br />
                          <span className="text-xs">
                            {order.truck_details[0].driver_name} (
                            {order.truck_details[0].driver_number})
                          </span>
                        </>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
