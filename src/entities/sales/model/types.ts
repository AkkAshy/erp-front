type Item = {
  product: string;
  quantity: number;
  price: string; // или number, если хотите привести к числу
};

type ParsedDetails = {
  total_amount: string; // или number, если хотите
  payment_method: string;
  cashier: string;
  customer: string;
  items: Item[];
};

type Results = {
  id: number;
  transaction: number;
  action: string;
  parsed_details: ParsedDetails;
  created_at: string; // ISO дата в строке
};

export type Transaction = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Results[];
};
//"cash" | "transfer" | "card" | "debt" | "hybrid"
export type PaymentPart = {
  method: "cash" | "card" | "transfer";
  amount: number;
};

export type Sale = {
  cashier?: number;
  payment_method: string;
  hybrid_payments?: PaymentPart[];
  new_customer?: { full_name: string; phone: string };
  customer?: number;
  total_amount?: number;
  items: { product_id: number; quantity: number; price?: number }[];
};
