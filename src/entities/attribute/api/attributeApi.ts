import { api } from "@/shared/api/base/client";
import type {
  CreateAttributeType,
  CreateAttributeValue,
} from "./types";

export const attributeApi = {
  // Attribute Types
  getAllTypes: (params?: { offset?: number; limit?: number }) =>
    api.get("/inventory/attribute-types/", { params }),

  createType: (data: CreateAttributeType) =>
    api.post("/inventory/attribute-types/", data),

  updateType: (id: number, data: Partial<CreateAttributeType>) =>
    api.patch(`/inventory/attribute-types/${id}/`, data),

  deleteType: (id: number) =>
    api.delete(`/inventory/attribute-types/${id}/`),

  // Attribute Values
  getAllValues: (params?: { offset?: number; limit?: number; attribute_type?: number }) =>
    api.get("/inventory/attribute-values/", { params }),

  createValue: (data: CreateAttributeValue) =>
    api.post("/inventory/attribute-values/", data),

  updateValue: (id: number, data: Partial<CreateAttributeValue>) =>
    api.patch(`/inventory/attribute-values/${id}/`, data),

  deleteValue: (id: number) =>
    api.delete(`/inventory/attribute-values/${id}/`),
};
