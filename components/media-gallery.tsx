"use client";

import { useEffect, useState } from "react";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import { getOrderMedia } from "@/lib/supabase";
import Image from "next/image";

interface MediaGalleryProps {
  orderId: string;
  refreshTrigger?: number;
}

interface MediaItem {
  id: string;
  media_url: string;
  description: string | null;
  uploaded_at: string;
}

export function MediaGallery({
  orderId,
  refreshTrigger = 0,
}: MediaGalleryProps) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedia = async () => {
      setLoading(true);
      setError(null);
      try {
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
      <div className="flex items-center justify-center py-6">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
        <ImageIcon className="h-6 w-6 text-muted-foreground mb-2" />
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  if (media.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
        <ImageIcon className="h-6 w-6 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">No media uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-2">
      <div className="grid grid-cols-2 gap-3">
        {media.map((item) => (
          <div
            key={item.id}
            className="group relative aspect-square overflow-hidden rounded-lg border bg-background"
          >
            {item.media_url ? (
              <Image
                src={item.media_url}
                alt={item.description || "Order media"}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
                onError={(e) => {
                  console.error("Error loading image:", e);
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder-image.png";
                }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <ImageIcon className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
            {item.description && (
              <div className="absolute inset-0 bg-black/50 p-2 opacity-0 transition-opacity group-hover:opacity-100">
                <p className="text-xs text-white line-clamp-2">
                  {item.description}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
