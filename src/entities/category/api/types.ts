export type AttributeTypeDetail = {
  id: number;
  name: string;
  slug: string;
  is_filterable: boolean;
  values: Array<{
    id: number;
    value: string;
    slug: string;
  }>;
};

export type CategoryItem = {
  id: number;
  name: string;
  created_at: string;
  attribute_types?: number[]; // IDs для записи
  attribute_types_detail?: AttributeTypeDetail[]; // Детальная информация для чтения
};
export type Category = {
  count: number;
  next: string | null;
  previous: string | null;
  results: CategoryItem[];
};
