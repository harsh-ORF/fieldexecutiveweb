"use client";

import { useEffect, useState } from "react";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import { getOrderMedia, OrderMedia } from "@/lib/supabase";
import Image from "next/image";

interface MediaGalleryProps {
  orderId: string;
  refreshTrigger?: number;
}

export function MediaGallery({ orderId, refreshTrigger }: MediaGalleryProps) {
  const [media, setMedia] = useState<OrderMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        setError(null);
        const mediaItems = await getOrderMedia(orderId);
        console.log("Fetched media items:", mediaItems); // Debug log
        setMedia(mediaItems);
      } catch (error) {
        console.error("Error fetching media:", error);
        setError("Failed to load media. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [orderId, refreshTrigger]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-destructive py-4">
        <p>{error}</p>
      </div>
    );
  }

  if (media.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="flex flex-col items-center gap-2">
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
          <p className="text-muted-foreground">No media uploaded yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {media.map((item) => (
        <div
          key={item.id}
          className="relative aspect-square rounded-lg overflow-hidden border bg-muted"
        >
          {item.media_url && (
            <>
              {item.media_type === "video" ? (
                <video
                  src={item.media_url}
                  className="object-cover w-full h-full"
                  controls
                />
              ) : (
                <Image
                  src={item.media_url}
                  alt={item.description || "Order media"}
                  fill
                  className="object-cover"
                />
              )}
            </>
          )}
          {item.description && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 text-white text-sm">
              {item.description}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
