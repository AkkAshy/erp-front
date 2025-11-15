import { api } from "@/shared/api/base/client";

export const analyticsApi = {
  getSales: (params: {
    date_gte: string;
    date_lte: string;
    payment_method?: string;
  }) => api.get("/analytics/sales/", { params }),

  getSalesSummary: (params: { start_date: string; end_date: string }) =>
    api.get("/analytics/sales/summary/", { params }),

  getProductAnalytics: (params: { product: number; date_gte: string }) =>
    api.get("/analytics/products/", { params }),

  getTopProducts: (params: { limit: number; start_date: string }) =>
    api.get("/analytics/products/top_products/", { params }),

  getCustomerAnalytics: (params: { customer: number; date_gte: string }) =>
    api.get("/analytics/customers/", { params }),

  getTopCustomers: (params: { limit: number; start_date: string }) =>
    api.get("/analytics/customers/top_customers/", { params }),

  getTransactionsByDay: (params: { date_from: string; date_to: string }) =>
    api.get("/analytics/transactions-by-day/", { params }),
};
