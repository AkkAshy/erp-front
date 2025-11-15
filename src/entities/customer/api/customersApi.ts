import { api } from "@/shared/api/base/client";

export const customersApi = {
  // get all
  getAll: () => api.get("/customers/"),

  //filter
  getFilteredCustomers: (params: {
    q?: string;
    date_from?: string;
    date_to?: string;
    offset?: number;
    limit?: number;
  }) => api.get("/customers/", { params }),
};
