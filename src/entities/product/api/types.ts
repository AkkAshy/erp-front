export type UpdateProduct = {
  id?: number;
  name: string;
  category: number | string;
  sale_price: number;
  unit: number | string;
};

export type CreateProduct = {
  id?: number;
  name: string;
  category: number | string;
  sale_price: number;
  unit: number | string;
  attribute_value_ids?: number[];

  batch_info: {
    size_id: number | null;
    quantity: number;
    purchase_price: number;
    supplier: string | null;
  }[];
};

export type SizeItem = {
  id: number;
  size: string;
  chest?: number;
  waist?: number;
  length?: number;
  selected?: boolean;
  quantity: number | string;
};

export type Size = {
  count: number;
  next: string | null;
  previous: string | null;
  results: SizeItem[];
};

type Batch = {
  id: number;
  product: number;
  product_name: string;
  quantity: number;
  purchase_price: string;
  size: string | null;
  supplier: string;
  expiration_date: string | null;
  created_at: string;
};

export type UnitInfo = {
  id: number;
  name: string;
  display_name: string;
  decimal_places: number;
};

export type ProductItem = {
  id: number;
  name: string;
  barcode: string | null;
  category: number;
  category_name: string;
  count?: number;
  sale_price: string;
  created_at: string;
  size: SizeItem | null;
  unit: UnitInfo;
  current_stock: number;
  batches: Batch[];
  image_label: string | null;
  created_by: {
    first_name: string;
  };
};

export type Product = {
  count: number;
  next: string | null;
  previous: string | null;
  results: ProductItem[];
};
