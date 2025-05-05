import { createClient } from "@supabase/supabase-js";

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase credentials. Please check your .env file.");
}

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types based on the database schema
export type Profile = {
  id: string;
  full_name: string | null;
  phone_number: string;
  email: string | null;
  profile_avatar: string | null;
  user_type: "buyer" | "seller" | string;
};

export type TruckDetail = {
  order_id: string;
  truck_number: string;
  driver_name: string;
  driver_number: string;
};

export type Order = {
  id: string;
  rfq_id: string | null;
  bid_id: string | null;
  buyer_id: string;
  seller_id: string;
  price_per_unit: number;
  quantity: number;
  nut_quality: "single_filter" | "double_filter" | "mixed_filter";
  youtube_stream_id: string | null;
  all_loading_completed: boolean | null;
  admin_approved_by: string | null;
  admin_approved_at: string | null;
  created_at: string;
  updated_at: string;
  nut_percentage: number;
  count: string | null;
  avg_weight: number | null;
  purchase_price: number | null;
  loading_date: string | null;
  actual_loading_date: string | null;
  dispatch_date: string | null;
  status:
    | "pending"
    | "approved"
    | "rejected"
    | "completed"
    | "loading_initiated"
    | "loading_started"
    | "loading_stopped"
    | "loading_completed";
  quality_rating: number | null;
  quantity_rating: number | null;
  overall_rating: number | null;
  person_in_charge: string | null;
  daily_loading: number[] | null;
  region_id: string | null;
  payment_status: string;
  buyer?: Profile;
  seller?: Profile;
  region?: {
    id: string;
    name: string;
  };
  truck_details?: TruckDetail[];
};

export type OrderMedia = {
  id: string;
  order_id: string;
  media_url: string | null;
  media_type: string | null;
  description: string | null;
  uploaded_at: string;
  uploaded_by: string | null;
};

// Helper function to fetch orders
export async function getOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      buyer:buyer_id(id, full_name, phone_number, email, profile_avatar),
      seller:seller_id(id, full_name, phone_number, email, profile_avatar),
      region:regions!orders_region_id_fkey(id, name),
      truck_details:truck_details(order_id, truck_number, driver_name, driver_number)
    `
    )
    .neq("status", "completed") // Filter out completed orders
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }

  return data as Order[];
}

// Helper function to fetch a single order
export async function getOrder(id: string) {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      buyer:buyer_id(id, full_name, phone_number, email, profile_avatar),
      seller:seller_id(id, full_name, phone_number, email, profile_avatar),
      region:regions!orders_region_id_fkey(id, name)
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching order:", error);
    return null;
  }

  return data as Order;
}

// Helper function to fetch order media
export async function getOrderMedia(orderId: string) {
  const { data, error } = await supabase
    .from("order_media")
    .select("*")
    .eq("order_id", orderId)
    .order("uploaded_at", { ascending: false });

  if (error) {
    console.error("Error fetching order media:", error);
    return [];
  }

  return data as OrderMedia[];
}

// Helper function to upload media
export async function uploadOrderMedia(
  orderId: string,
  file: File,
  description: string | null = null,
  uploadedBy: string | null = null
) {
  console.log("Starting media upload process...");
  console.log("Order ID:", orderId);
  console.log("File:", file.name);
  console.log("Description:", description);
  console.log("Uploaded by:", uploadedBy);

  // Validate file type
  const allowedImageTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  const allowedVideoTypes = ["video/mp4", "video/webm", "video/quicktime"];

  if (![...allowedImageTypes, ...allowedVideoTypes].includes(file.type)) {
    console.error("Invalid file type:", file.type);
    return null;
  }

  // First upload the file to storage
  const fileExt = file.name.split(".").pop();
  const fileName = `${orderId}/${Math.random()
    .toString(36)
    .substring(2)}.${fileExt}`;
  const filePath = `order-media/${fileName}`;

  console.log("Uploading file to storage:", filePath);

  const { error: uploadError, data: uploadData } = await supabase.storage
    .from("order-media")
    .upload(filePath, file);

  if (uploadError) {
    console.error("Error uploading file to storage:", uploadError);
    return null;
  }

  console.log("File uploaded successfully to storage");

  // Get the public URL
  const { data: urlData } = supabase.storage
    .from("order-media")
    .getPublicUrl(filePath);
  const mediaUrl = urlData.publicUrl;

  console.log("Generated public URL:", mediaUrl);

  // Determine media type based on file extension
  const mediaType = file.type.startsWith("video/") ? "video" : "image";

  console.log("Media type:", mediaType);

  // Create an entry in the order_media table
  const insertData = {
    order_id: orderId,
    media_url: mediaUrl,
    media_type: mediaType,
    description: description,
    uploaded_by: uploadedBy || "016f8928-e368-44ce-a3af-7b38bf712f09", // Default to hardcoded user ID if none provided
  };

  console.log("Inserting into order_media table:", insertData);

  const { data, error } = await supabase
    .from("order_media")
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error("Error creating order media entry:", error);
    return null;
  }

  // Also insert into region_media table
  const regionMediaData = await insertRegionMedia(orderId, mediaUrl);
  if (!regionMediaData) {
    console.error("Failed to insert into region_media table");
  }

  console.log("Successfully inserted into order_media table:", data);
  return data as OrderMedia;
}

// Helper function to delete order media
export async function deleteOrderMedia(id: string) {
  // First get the media to get the file path
  const { data: media, error: fetchError } = await supabase
    .from("order_media")
    .select("media_url")
    .eq("id", id)
    .single();

  if (fetchError) {
    console.error("Error fetching media:", fetchError);
    return false;
  }

  // Extract the path from the URL
  let filePath = "";
  if (media.media_url) {
    const url = new URL(media.media_url);
    filePath = url.pathname.split("/").slice(2).join("/");
  }

  // Delete the file from storage if a path exists
  if (filePath) {
    const { error: storageError } = await supabase.storage
      .from("order-media")
      .remove([filePath]);

    if (storageError) {
      console.error("Error deleting file:", storageError);
      // Continue to delete the database entry even if storage delete fails
    }
  }

  // Delete the database entry
  const { error } = await supabase.from("order_media").delete().eq("id", id);

  if (error) {
    console.error("Error deleting media entry:", error);
    return false;
  }

  return true;
}

// Helper function to insert media into region_media table
export async function insertRegionMedia(orderId: string, mediaUrl: string) {
  // First get the order to get region_id and nut_quality
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("region_id, nut_quality")
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    console.error("Error fetching order:", orderError);
    return null;
  }

  // Map nut_quality to type
  const typeMap: Record<string, string> = {
    single_filter: "single",
    double_filter: "double",
    mixed_filter: "mixed",
  };

  const type = typeMap[order.nut_quality] || "single";

  // Insert into region_media table
  const { data, error } = await supabase
    .from("region_media")
    .insert({
      region_id: order.region_id,
      url: mediaUrl,
      type: type,
    })
    .select()
    .single();

  if (error) {
    console.error("Error inserting region media:", error);
    return null;
  }

  return data;
}
