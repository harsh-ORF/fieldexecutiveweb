"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { uploadOrderMedia } from "@/lib/supabase";
import { toast } from "sonner";
import Image from "next/image";

interface MediaUploadProps {
  orderId: string;
  onSuccess?: () => void;
}

export function MediaUpload({ orderId, onSuccess }: MediaUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  // Ref for camera input
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  // Camera capture handler
  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFiles((prev) => [...prev, e.target.files![0]]);
    }
  };

  const openCamera = () => {
    cameraInputRef.current?.click();
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      toast.error("Please select at least one file to upload");
      return;
    }

    setUploading(true);
    try {
      const uploadPromises = files.map((file) =>
        uploadOrderMedia(
          orderId,
          file,
          description,
          "016f8928-e368-44ce-a3af-7b38bf712f09" // Hardcoded user ID
        )
      );

      const results = await Promise.all(uploadPromises);
      const failedUploads = results.filter((result) => !result);

      if (failedUploads.length > 0) {
        throw new Error(`Failed to upload ${failedUploads.length} files`);
      }

      toast.success(`Successfully uploaded ${files.length} files`);
      setFiles([]);
      setDescription("");
      onSuccess?.();
    } catch (error) {
      console.error("Error uploading media:", error);
      toast.error("Failed to upload some files. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="media">Select Media</Label>
        <div className="flex items-center gap-2">
          <Input
            id="media"
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="cursor-pointer"
            multiple
          />
          <Button type="button" variant="outline" onClick={openCamera}>
            Click Photo
          </Button>
          <input
            type="file"
            ref={cameraInputRef}
            accept="image/*"
            capture="environment"
            onChange={handleCameraCapture}
            className="hidden"
          />
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <Label>Preview</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {files.map((file, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden border bg-muted"
              >
                {file.type.startsWith("video/") ? (
                  <video
                    src={URL.createObjectURL(file)}
                    className="object-cover w-full h-full"
                    controls
                  />
                ) : (
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a description for these media files"
        />
      </div>

      <Button
        type="submit"
        disabled={files.length === 0 || uploading}
        className="w-full"
      >
        {uploading ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Uploading {files.length} files...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload {files.length} {files.length === 1 ? "File" : "Files"}
          </div>
        )}
      </Button>
    </form>
  );
}
