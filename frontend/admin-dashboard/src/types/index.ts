export type AdminRole = "admin" | "staff";

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: AdminRole;
};

export type Product = {
  id: number;
  category_id: number | null;
  category_name?: string | null;
  gold_type_id: number | null;
  gold_type_name?: string | null;
  making_type_id: number | null;
  making_type_name?: string | null;
  sku: string | null;
  title: string;
  collection_name: string;
  short_description?: string | null;
  number_of_pcs?: number | null;
  display_finish?: string | null;
  weight_specifications?: Array<{ label: string; value: string }>;
  technical_specifications?: Array<{ feature: string; details: string }>;
  manufacturing_support?: string | null;
  product_url?: string | null;
  product_images: string[];
};

export type Category = {
  id: number;
  collection_type: "18k" | "22k";
  category: string;
  category_name?: string;
  category_id?: number | null;
  collection_url?: string | null;
  subcategory_url?: string | null;
  image?: string | null;
  image_url?: string | null;
};

export type GoldType = {
  id: number;
  name: string;
  purity: number;
  image?: string | null;
  image_url?: string | null;
  is_active: number;
  isActive: boolean;
};

export type CategoryNew = {
  id: number;
  name: string;
  slug: string;
  image?: string | null;
  image_url?: string | null;
  is_active: number;
  isActive: boolean;
};

export type MakingType = {
  id: number;
  name: string;
  image?: string | null;
  image_url?: string | null;
  is_active: number;
  isActive: boolean;
};

export type Event = {
  id: number;
  title: string;
  location?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  description?: string | null;
  event_image: string[];
  image_urls?: string[];
  event_url?: string | null;
  status: "upcoming" | "past";
};

export type Clientele = {
  id: number;
  clientele_title: string;
  clientele_image: string;
  image_url?: string | null;
  country: string;
};
