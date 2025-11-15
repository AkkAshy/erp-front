import { api } from "@/shared/api/base/client";
import type { CreateProduct, UpdateProduct } from "./types";

export const productApi = {
  // scan barcode
  scanBarcode: (barcode: string) =>
    api.get(`/inventory/products/scan_barcode/`, {
      params: { barcode },
    }),

  // create product
  create: (data: CreateProduct) =>
    api.post("/inventory/products/create_multi_size/", data),

  // update product
  updateProduct: (data: UpdateProduct) =>
    api.patch(`/inventory/products/${data.id}/`, data),

  updateBatch: (data: {
    id: number;
    quantity: number;
    purchase_price: number;
    supplier: string;
  }) => api.patch(`/inventory/batches/${data.id}/`, data),

  // delete
  delete: (id: number) => api.delete(`/inventory/products/${id}/`),

  //get all products
  getAll: () => api.get("/inventory/products/"),

  //add to batch
  addBatch: (data: {
    barcode: string;
    batch_info: {
      quantity: number;
      purchase_price: number;
      supplier: string;
      expiration_date: string | null;
    };
  }) => api.post("/inventory/products/", data),

  // filter
  getFilteredProducts: (params: {
    search?: string;
    category?: number | string;
    attributes__attribute_type?: string;
    created_by?: number | string;
    offset?: number;
    limit?: number;
  }) => api.get("/inventory/products/", { params }),

  // low stock
  getLowStockProducts: (min_quantity: number = 5) =>
    api.get("/inventory/products/low_stock/", {
      params: { min_quantity },
    }),

  // inventory Stats
  getInventoryStats: () => api.get("/inventory/stats/"),

  // add size
  addSize: (data: {
    size: string;
    chest?: number;
    waist?: number;
    length?: number;
  }) => api.post("/inventory/size-info/", data),

  updateSize: (id: number, size: string) =>
    api.patch(`/inventory/size-info/${id}/`, { size }),

  // delete size
  deleteSize: (id: number | string) => api.delete(`/inventory/size-info/${id}/`),

  getAllSizes: () => api.get("/inventory/size-info/"),

  // filtered
  getFilteredSizes: (params: {
    search?: string;
    offset?: number;
    limit?: number;
  }) => api.get("/inventory/size-info/", { params }),

  // available sizes
  getAvailableSizes: (params: { name?: string }) =>
    api.get("/inventory/products/sizes_summary/", { params }),
};
