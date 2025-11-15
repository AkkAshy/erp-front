import { api } from "@/shared/api/base/client";
import type { Sale } from "../model/types";

export const salesApi = {
  createSale: (data: Sale) => api.post("/sales/transactions/", data),

  getFilteredTransactions: (params: {
    transaction_id?: number | string;
    cashier?: number | string;
    date_from?: string;
    date_to?: string;
    offset?: number;
    limit?: number;
  }) => api.get("sales/transaction-history/", { params }),
};
