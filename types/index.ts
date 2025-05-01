export interface SearchParams {
  query?: string;
  page?: string;
  status?: string;
  region?: string;
  sort?: string;
}

export interface Order {
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
  status: string;
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
}

export interface Profile {
  id: string;
  full_name: string | null;
  phone_number: string;
  email: string | null;
  profile_avatar: string | null;
  user_type: "buyer" | "seller" | string;
}

export interface TruckDetail {
  id: string;
  order_id: string;
  truck_number: string;
  driver_name: string;
  driver_number: string;
  created_at: string;
  updated_at: string;
}

export interface OrderMedia {
  id: string;
  order_id: string;
  file_path: string;
  description: string;
  uploaded_at: string;
  media_type: string;
}

export interface Region {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}
