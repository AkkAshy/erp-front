import { api } from "@/shared/api/base/client";

export const categoryApi = {
  // get all
  getAll: () => api.get("/inventory/categories/"),

  // filter
  getFilteredCategories: (params: { offset?: number; limit?: number }) =>
    api.get("/inventory/categories/", { params }),

  //create
  create: (data: { name: string; attribute_types?: number[] }) =>
    api.post("/inventory/categories/", data),

  // update
  update: (id: number, data: { name?: string; attribute_types?: number[] }) =>
    api.patch(`/inventory/categories/${id}/`, data),

  // delete category
  deleteCategory: (id: number | string) =>
    api.delete(`/inventory/categories/${id}/`),
};
