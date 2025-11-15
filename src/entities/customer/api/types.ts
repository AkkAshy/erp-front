export type Customer = {
  id: number;
  full_name: string;
  phone: string;
  debt: string;
  created_at: string; // ISO-строка даты
  last_purchase_date: string; // ISO-строка даты
  total_spent: string;
  purchase_count: number;
  selected: boolean;
};

export type CustomersResult = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Customer[];
};
