"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DailyLoadingInputProps {
  dailyLoading: number[];
  orderId: string;
  onUpdate: (newLoading: number[]) => Promise<void>;
}

export function DailyLoadingInput({
  dailyLoading,
  orderId,
  onUpdate,
}: DailyLoadingInputProps) {
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState("");

  const handleAdd = async () => {
    const pieces = parseInt(quantity);
    if (isNaN(pieces) || pieces <= 0) {
      toast.error("Please enter a valid number of pieces");
      return;
    }

    setLoading(true);
    try {
      const newLoading = [...dailyLoading, pieces];
      await onUpdate(newLoading);
      setQuantity("");
      toast.success("Daily loading added successfully");
    } catch (error) {
      console.error("Error adding daily loading:", error);
      toast.error("Failed to add daily loading");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (index: number) => {
    setLoading(true);
    try {
      const newLoading = dailyLoading.filter((_, i) => i !== index);
      await onUpdate(newLoading);
      toast.success("Daily loading removed successfully");
    } catch (error) {
      console.error("Error removing daily loading:", error);
      toast.error("Failed to remove daily loading");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="number"
          placeholder="Enter number of pieces loaded today"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          disabled={loading}
          min="1"
          step="1"
        />
        <Button onClick={handleAdd} disabled={loading || !quantity}>
          Add
        </Button>
      </div>

      <div className="space-y-2">
        {dailyLoading.map((pieces, index) => (
          <Card key={index}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">Day {index + 1}</p>
                <p className="text-sm text-muted-foreground">
                  {pieces.toLocaleString()} pieces
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemove(index)}
                disabled={loading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
